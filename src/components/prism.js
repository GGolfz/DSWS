import { Fragment } from "preact";
import { useState } from "preact/hooks";

const Prism = () => {
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
  const computePrismRule = () => {
    let classes = new Set([...data.map((e) => e[e.length - 1])]);
    classes = Array.from(classes);
    let tempData = [];
    data.forEach((e) => tempData.push([...e]));

    let alphas = [];
    for (let i in colName.slice(0, colName.length - 1)) {
      let values = new Set([...tempData.map((e) => e[i])]);
      values = Array.from(values);
      for (let j in values) {
        alphas.push({
          column: colName[i],
          columnIndex: i,
          value: values[j],
          probability: 0,
        });
      }
    }
    let rules = [];
    for (let c of classes) {
      let valid = true;
      while (valid) {
        rules.push({
          rule: getRule(c, alphas, tempData, []),
          class: c,
        });
        tempData = data.filter((dt) => {
          let valid = true;
          rules.forEach((r) => {
            let match = 0;
            for (let i of r.rule) {
              if (dt[i.columnIndex] === i.value) {
                match++;
              }
            }
            if (match == r.rule.length) {
              valid = false;
            }
          });
          return valid;
        });
        alphas = [];
        for (let i in colName.slice(0, colName.length - 1)) {
          let values = new Set([...tempData.map((e) => e[i])]);
          values = Array.from(values);
          for (let j in values) {
            alphas.push({
              column: colName[i],
              columnIndex: i,
              value: values[j],
              probability: 0,
            });
          }
        }
        if (tempData.length == 0) {
          valid = false;
        } else {
          let remain = tempData.filter((t) => t[t.length - 1] == c);
          valid = remain.length != 0;
        }
      }
    }
    setResult(rules);
  };
  const getRule = (c, alphas, tempData, rules) => {
    for (let a of alphas) {
      let count = 0;
      let found = 0;
      for (let i = 0; i < tempData.length; i++) {
        if (tempData[i][a.columnIndex] == a.value) {
          count += 1;
          if (tempData[i][colName.length - 1] == c) {
            found += 1;
          }
        }
      }
      a.probability = found / count;
      a.count = count;
      a.found = found;
    }
    let maxAlpha = alphas[0];
    for (let a of alphas) {
      if (a.probability >= maxAlpha.probability) {
        if (
          maxAlpha.probability == 1 ||
          a.probability == maxAlpha.probability
        ) {
          if (a.found > maxAlpha.found) {
            maxAlpha = a;
          }
        } else {
          maxAlpha = a;
        }
      }
    }
    let temp = [];
    if (maxAlpha.probability == 1) {
      for (let i in tempData) {
        if (tempData[i][maxAlpha.columnIndex] != maxAlpha.value) {
          temp.push(tempData[i]);
        }
      }
      tempData = [...temp];
      return [...rules, maxAlpha];
    } else {
      let subsetData = [];
      alphas = alphas.filter((e) => e != maxAlpha);
      subsetData = tempData.filter(
        (e) => e[maxAlpha.columnIndex] == maxAlpha.value
      );
      return getRule(c, alphas, subsetData, [...rules, maxAlpha]);
    }
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

  const renderResult = (result) => {
    return (
      <Fragment>
        {result.map((r, index) => (
          <div>
            Rule {index + 1}:{" "}
            {r.rule.map((e) => e.column + " = " + e.value).join(" ^ ")} =&gt;{" "}
            {r.class}
          </div>
        ))}
      </Fragment>
    );
  };
  return (
    <Fragment>
      <h1>PRISM Calculator</h1>
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
        <button onClick={computePrismRule}>Compute PRISM</button>
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

export default Prism;
