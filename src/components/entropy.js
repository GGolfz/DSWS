import { Fragment } from "preact";
import {  useState } from "preact/hooks";

const Entropy = () => {
  const row = 6;
  const col = 3;
  const [colName, setColName] = useState(
    Array(col)
      .fill("")
      .map((_, index) => "Feature " + (index + 1))
  );
  const [rowName, setRowName] = useState(Array(row).fill(""));
  const [data, setData] = useState(Array(row).fill(Array(col).fill("")));
  const [result, setResult] = useState(null);
  const generateHeaderRow = () => {
    let arr = [];
    for (let i = 0; i < colName.length - 1; i++) {
      arr.push(
        <th>
          <input
            type="text"
            value={colName[i]}
            onChange={(e) => changeColumnName(i, e.target.value)}
          />
        </th>
      );
    }
    arr.push(<th>Output Feature</th>);

    return arr;
  };
  const changeColumnName = (index, value) => {
    let temp = [...colName];
    temp[index] = value;
    setColName(temp);
  };
  const changeData = (row, col, value) => {
    let tempData = [];
    data.forEach((e) => tempData.push(e.slice()));
    tempData[row][col] = value;
    setData(tempData);
  };
  const generateTableData = () => {
    let arr = [];
    for (let i = 0; i < rowName.length; i++) {
      let arrc = [];
      for (let j = 0; j < colName.length; j++) {
        arrc.push(
          <td>
            <input
              type="text"
              value={data[i][j]}
              onChange={(e) => changeData(i, j, e.target.value)}
            />
          </td>
        );
      }
      arr.push(<tr>{arrc}</tr>);
    }
    return arr;
  };
  const addRow = () => {
    let tempName = [...rowName];
    tempName.push("");
    let tempData = [];
    data.forEach((e) => tempData.push(e.slice()));
    tempData.push(Array(colName.length).fill(0));
    setRowName(tempName);
    setData(tempData);
  };
  const deleteRow = () => {
    if (rowName.length > 1) {
      let tempName = [...rowName];
      tempName.pop();
      let tempData = [];
      data.forEach((e) => tempData.push(e.slice()));
      tempData.pop();
      setRowName(tempName);
      setData(tempData);
    } else {
      alert("Cannot delete row!");
    }
  };
  const addCol = () => {
    let tempName = [...colName];
    tempName.push("Feature " + (colName.length + 1));
    let tempData = [];
    data.forEach((e) => tempData.push([...e.slice(), 0]));
    setColName(tempName);
    setData(tempData);
  };
  const deleteCol = () => {
    if (colName.length > 3) {
      let tempName = [...colName];
      tempName.pop();
      let tempData = [];
      data.forEach((e) => tempData.push(e.slice(0, e.length - 1)));
      setColName(tempName);
      setData(tempData);
    } else {
      alert("Cannot delete column!");
    }
  };
  const computeEntropy = () => {
    let originalEntropy = 0;
    let outputCount = {};
    for (let i of data) {
      if (!(i[i.length - 1] in outputCount)) {
        outputCount[i[i.length - 1]] = 0;
      }
      outputCount[i[i.length - 1]] += 1;
    }
    for (let i in outputCount) {
      let p = outputCount[i] / data.length;
      originalEntropy += p * Math.log2(p);
    }
    if (originalEntropy < 0) originalEntropy = -1 * originalEntropy;
    let entropyData = {};
    for (let i = 0; i < colName.length - 1; i++) {
      let featureOutputCount = { sum: 0, data: {} };
      entropyData[colName[i]] = { branch: {}, entropy: 0, ig: 0 };
      for (let j = 0; j < data.length; j++) {
        if (!(data[j][i] in featureOutputCount["data"])) {
          featureOutputCount["data"][data[j][i]] = { sum: 0, data: {} };
        }
        if (
          !(
            data[j][colName.length - 1] in
            featureOutputCount["data"][data[j][i]]["data"]
          )
        ) {
          featureOutputCount["data"][data[j][i]]["data"][
            data[j][colName.length - 1]
          ] = 0;
        }
        featureOutputCount.sum += 1;
        featureOutputCount["data"][data[j][i]].sum += 1;
        featureOutputCount["data"][data[j][i]]["data"][
          data[j][colName.length - 1]
        ] += 1;
      }
      let entropyFeature = 0;
      for (let k in featureOutputCount["data"]) {
        let entropyFeatureBranch = 0;
        for (let l in featureOutputCount["data"][k]["data"]) {
          let p =
            featureOutputCount["data"][k]["data"][l] /
            featureOutputCount["data"][k].sum;
          entropyFeatureBranch += p * Math.log2(p);
        }
        if (entropyFeatureBranch < 0)
          entropyFeatureBranch = -1 * entropyFeatureBranch;
        entropyData[colName[i]]["branch"][k] = entropyFeatureBranch;
        entropyFeature +=
          (featureOutputCount["data"][k].sum / featureOutputCount.sum) *
          entropyFeatureBranch;
      }
      entropyData[colName[i]]["entropy"] = entropyFeature;
      entropyData[colName[i]]["ig"] = originalEntropy - entropyFeature;
    }
    setResult({
      originalEntropy,
      entropyData,
    });
  };
  const renderResult = (result) => {
    let render = [];
    render.push(
      <div>
        <b>Original Entropy: {result.originalEntropy} </b>
      </div>
    );
    for (let i in result.entropyData) {
      render.push(
        <div>
          <h4>{i}</h4>
          <ul>
            <li>Entropy: {result.entropyData[i].entropy}</li>
            <li>IG: {result.entropyData[i].ig}</li>
            <li>Branch Entropy: {JSON.stringify(result.entropyData[i].branch)}</li>
          </ul>{" "}
        </div>
      );
    }
    return render;
  };
  return (
    <Fragment>
      <h1>Entropy Calculator</h1>
      <div>
        <table>
          <tr>{generateHeaderRow()}</tr>
          {generateTableData()}
        </table>
        <button onClick={addRow}>+ row</button>
        <button onClick={deleteRow}>- row</button>
        <button onClick={addCol}>+ column</button>
        <button onClick={deleteCol}>- column</button> <br />
        <button onClick={computeEntropy}>Compute Entropy</button>
        {result ? (
          <div>
            <h3>Result:</h3>
            {renderResult(result)}
          </div>
        ) : null}
      </div>
    </Fragment>
  );
};

export default Entropy;
