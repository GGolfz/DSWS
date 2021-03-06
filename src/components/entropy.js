import { Fragment } from "preact";
import { useState } from "preact/hooks";

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
  const handleUploadFile = (e) => {
    if (e.target.files && e.target.files.length > 0 && e.target.files[0]) {
      let file = e.target.files[0];
      var reader = new FileReader();
      reader.addEventListener("load", (e) => {
        let csvData = e.target.result;
        csvData = csvData.split("\n");
        csvData = csvData.map((e) => e.split(","));
        setRowName(Array(csvData.length - 1).fill(""));
        setColName(csvData[0]);
        setData(csvData.slice(1, csvData.length));
      });
      reader.readAsBinaryString(file);
    }
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
    tempData.push(Array(colName.length).fill(""));
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
    data.forEach((e) => tempData.push([...e.slice(), ""]));
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
    let originalGini = 1;
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
      originalGini -= p * p;
    }
    if (originalEntropy < 0) originalEntropy = -1 * originalEntropy;
    let entropyData = {};
    for (let i = 0; i < colName.length - 1; i++) {
      let featureOutputCount = { sum: 0, data: {} };
      entropyData[colName[i]] = { branch: {}, gini: {}, entropy: 0, ig: 0 };
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
      let splitInfo = 0;
      for (let k in featureOutputCount["data"]) {
        let entropyFeatureBranch = 0;
        let featureGiniD1 = 1;
        let featureGiniD2 = 1;
        for (let l in outputCount) {
          if (l in featureOutputCount["data"][k]["data"]) {
            let p =
              featureOutputCount["data"][k]["data"][l] /
              featureOutputCount["data"][k].sum;
            entropyFeatureBranch += p * Math.log2(p);
            featureGiniD1 -= p * p;
            let p2 =
              (outputCount[l] - featureOutputCount["data"][k]["data"][l]) /
              (featureOutputCount.sum - featureOutputCount["data"][k].sum);
            featureGiniD2 -= p2 * p2;
          } else {
            let p2 =
              outputCount[l] /
              (featureOutputCount.sum - featureOutputCount["data"][k].sum);
            featureGiniD2 -= p2 * p2;
          }
        }
        if (entropyFeatureBranch < 0)
          entropyFeatureBranch = -1 * entropyFeatureBranch;
        entropyData[colName[i]]["branch"][k] = entropyFeatureBranch;
        entropyFeature +=
          (featureOutputCount["data"][k].sum / featureOutputCount.sum) *
          entropyFeatureBranch;
        let p1 = featureOutputCount["data"][k].sum / featureOutputCount.sum;
        splitInfo += p1 * Math.log2(p1);
        featureGiniD1 *=
          featureOutputCount["data"][k].sum / featureOutputCount.sum;
        featureGiniD2 *=
          (featureOutputCount.sum - featureOutputCount["data"][k].sum) /
          featureOutputCount.sum;

        entropyData[colName[i]]["gini"][k] = {
          gini: featureGiniD1 + featureGiniD2,
          reduction: originalGini - (featureGiniD1 + featureGiniD2),
        };
      }
      if (splitInfo < 0) {
        splitInfo = -1 * splitInfo;
      }
      entropyData[colName[i]]["entropy"] = entropyFeature;
      entropyData[colName[i]]["ig"] = originalEntropy - entropyFeature;
      entropyData[colName[i]]["splitInfo"] = splitInfo;
      entropyData[colName[i]]["gainRatio"] =
        entropyData[colName[i]]["ig"] / splitInfo;
    }
    setResult({
      originalEntropy,
      originalGini,
      entropyData,
    });
  };
  const renderResult = (result) => {
    let render = [];
    render.push(
      <div>
        <b>Original Entropy: {result.originalEntropy} </b>
        <br />
        <b>Original Gini: {result.originalGini} </b>
      </div>
    );
    for (let i in result.entropyData) {
      render.push(
        <div>
          <h4>{i}</h4>
          <ul>
            <li>Entropy: {result.entropyData[i].entropy}</li>
            <li>IG: {result.entropyData[i].ig}</li>
            <li>
              Branch Entropy: {JSON.stringify(result.entropyData[i].branch)}
            </li>
            <li>Split Info: {result.entropyData[i].splitInfo}</li>
            <li>Gain Ratio: {result.entropyData[i].gainRatio}</li>
            <li>
              Gini:{" "}
              {Object.keys(result.entropyData[i].gini).length == 2
                ? result.entropyData[i].gini[
                    Object.keys(result.entropyData[i].gini)[0]
                  ].gini
                : JSON.stringify(
                    Object.keys(result.entropyData[i].gini).map((key) => ({
                      [key]: result.entropyData[i].gini[key].gini,
                    }))
                  )}
            </li>
            <li>
              Reduction in Impurity:{" "}
              {Object.keys(result.entropyData[i].gini).length == 2
                ? result.entropyData[i].gini[
                    Object.keys(result.entropyData[i].gini)[0]
                  ].reduction
                : JSON.stringify(
                    Object.keys(result.entropyData[i].gini).map((key) => ({
                      [key]: result.entropyData[i].gini[key].reduction,
                    }))
                  )}
            </li>
          </ul>{" "}
        </div>
      );
    }
    return render;
  };
  const compaction = () => {
    const tempData = [...data];
    const tempName = [...rowName];
    for (let i = 0; i < tempData.length; i++) {
      if (tempData[i].every((el) => el == "")) {
        tempData.splice(i, 1);
        tempName.pop();
        i--;
      }
    }
    setData(tempData);
    setRowName(tempName);
  };
  return (
    <Fragment>
      <h1>Entropy Calculator</h1>
      <input
        type="file"
        accept=".csv"
        multiple={false}
        onChange={handleUploadFile}
      />
      <div>
        <table>
          <tr>{generateHeaderRow()}</tr>
          {generateTableData()}
        </table>
        <button onClick={addRow}>+ row</button>
        <button onClick={deleteRow}>- row</button>
        <button onClick={addCol}>+ column</button>
        <button onClick={deleteCol}>- column</button> <br />
        <button onClick={compaction}>Compaction</button>
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
