import { useEffect, useState } from "preact/hooks";
const App = () => {
  const row = 3;
  const col = 4;
  const [colName, setColName] = useState(
    Array(col)
      .fill("")
      .map((_, index) => "Feature " + (index + 1))
  );
  const [rowName, setRowName] = useState(
    Array(row)
      .fill("")
      .map((_, index) => "Name " + (index + 1))
  );
  const [target, setTarget] = useState(null);
  const [data, setData] = useState(Array(row).fill(Array(col).fill(0)));
  const [max, setMax] = useState(-1);
  const [result, setResult] = useState(null);
  const generateHeaderRow = () => {
    let arr = [<th></th>];
    for (let i = 0; i < colName.length; i++) {
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
    return arr.map((e) => e);
  };
  const addRow = () => {
    let tempName = [...rowName];
    tempName.push("Name " + (rowName.length + 1));
    let tempData = [];
    data.forEach((e) => tempData.push(e.slice()));
    tempData.push(Array(col).fill(0));
    setRowName(tempName);
    setData(tempData);
  };
  const deleteRow = () => {
    if (rowName.length > 1) {
      if (target >= rowName.length - 1) {
        setTarget(null);
      }
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
    if (colName.length > 1) {
      let tempName = [...colName];
      tempName.pop();
      let tempData = [];
      data.forEach((e) => tempData.push(e.slice(0, e.length - 1)));
      setColName(tempName);
      setData(tempData);
    } else {
      alert("Cannot delete col!");
    }
  };
  const changeColumnName = (index, value) => {
    console.log(value);
    let temp = [...colName];
    temp[index] = value;
    setColName(temp);
  };
  const changeRowName = (index, value) => {
    console.log(value);
    let temp = [...rowName];
    temp[index] = value;
    setRowName(temp);
  };
  const changeData = (row, col, value) => {
    let tempData = [];
    data.forEach((e) => tempData.push(e.slice()));
    if (!Number.isNaN(parseInt(value))) {
      tempData[row][col] = parseInt(value);
    } else {
      tempData[row][col] = parseInt(value);
    }
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
      arr.push(
        <tr>
          <td>
            <input
              type="text"
              onChange={(e) => changeRowName(i, e.target.value)}
              value={rowName[i]}
            />
          </td>
          {arrc}
        </tr>
      );
    }
    return arr;
  };
  const manhattan = () => {
    let tempResult = [];
    let tempMax = -1;
    for (let i = 0; i < rowName.length; i++) {
      let temp = 0;
      for (let j = 0; j < colName.length; j++) {
        temp += Math.abs(data[parseInt(target)][j] - data[i][j]);
      }
      tempResult.push(temp);
      if ((target != i && tempMax == -1) || temp < tempResult[max]) {
        tempMax = i;
      }
    }
    setMax(tempMax);
    setResult(tempResult);
  };
  const handleChangeTarget = (value) => {
    setTarget(parseInt(value));
  };
  const showData = () => {
    console.log(data);
    console.log(colName);
    console.log(rowName);
  };
  return (
    <div id="app">
      <h1>Similarity Calculator</h1>
      <table>
        <tr>{generateHeaderRow()}</tr>
        {generateTableData()}
      </table>
      <button onClick={showData}>Show Data</button>
      <button onClick={addRow}>+ row</button>
      <button onClick={deleteRow}>- row</button>
      <button onClick={addCol}>+ column</button>
      <button onClick={deleteCol}>- column</button> <br />
      <select
        value={target}
        onChange={(e) => handleChangeTarget(e.target.value)}
      >
        {target == null ? <option>Select Target</option> : null}
        {rowName.map((e, index) => (
          <option value={index}>{e}</option>
        ))}
      </select>
      <button onClick={manhattan}>Manhattan</button>
      {result != null &&
        result.map((e, i) => <div>{rowName[i] + ": " + e}</div>)}
      {result != null ? (
        <div>{"The first most similar is " + rowName[max]}</div>
      ) : null}
    </div>
  );
};

export default App;
