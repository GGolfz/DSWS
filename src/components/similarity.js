import { Fragment } from "preact";
import { useState } from "preact/hooks";
const Similarity = () => {
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
  const [method, setMethod] = useState(null);
  const [data, setData] = useState(Array(row).fill(Array(col).fill(0)));
  const [max, setMax] = useState(-1);
  const [result, setResult] = useState(null);
  const [description, setDescription] = useState([]);
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
    return arr;
  };
  const addRow = () => {
    let tempName = [...rowName];
    tempName.push("Name " + (rowName.length + 1));
    let tempData = [];
    data.forEach((e) => tempData.push(e.slice()));
    tempData.push(Array(colName.length).fill(0));
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
      alert("Cannot delete column!");
    }
  };
  const changeColumnName = (index, value) => {
    let temp = [...colName];
    temp[index] = value;
    setColName(temp);
  };
  const changeRowName = (index, value) => {
    let temp = [...rowName];
    temp[index] = value;
    setRowName(temp);
  };
  const changeData = (row, col, value) => {
    let tempData = [];
    data.forEach((e) => tempData.push(e.slice()));
    if (!Number.isNaN(parseFloat(value))) {
      tempData[row][col] = parseFloat(value);
    } else {
      tempData[row][col] = 0;
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
  const handleCompute = () => {
    switch (method) {
      case "manhattan":
        manhattan();
        break;
      case "smc":
        smc();
        break;
      case "jaccard":
        jaccard();
        break;
      case "hamming":
        hamming();
        break;
      case "euclid":
        euclid();
        break;
      case "cosine":
        cosine();
        break;
    }
  };
  const smc = () => {
    let tempResult = [];
    let tempMax = -1;
    let descList = [];
    for (let i = 0; i < rowName.length; i++) {
      let desc = '';
      let temp = [0,0];
      for (let j = 0; j < colName.length; j++) {
        if (data[parseInt(target)][j] == data[i][j]) {
          if(data[i][j] == 0) {
            temp[0] += 1;
          } else {
            temp[1] += 1;
          }
        }
      }
      desc += rowName[i] + ": (" + temp[0]+"+"+temp[1] + ")/" + colName.length + " = " + (temp[0]+temp[1])+"/"+colName.length;
      temp = (temp[0]+temp[1]) / colName.length;
      desc += " = "+temp ;
      descList.push(desc);
      tempResult.push(temp);
      if (target != i && (tempMax == -1 || temp > tempResult[tempMax])) {
        tempMax = i;
      }
    }
    setMax(tempMax);
    setDescription(descList);
    setResult(tempResult);
  };
  const jaccard = () => {
    let tempResult = [];
    let tempMax = -1;
    for (let i = 0; i < rowName.length; i++) {
      let temp = 0;
      let count = 0;
      for (let j = 0; j < colName.length; j++) {
        if (
          !(data[i][j] == 0 && data[parseInt(target)][j] == 0) &&
          data[parseInt(target)][j] == data[i][j]
        ) {
          temp += 1;
        }
        if (!(data[i][j] == 0 && data[parseInt(target)][j] == 0)) {
          count += 1;
        }
      }
      temp = temp / count;
      tempResult.push(temp);
      if (target != i && (tempMax == -1 || temp > tempResult[tempMax])) {
        tempMax = i;
      }
    }
    setMax(tempMax);
    setDescription([]);
    setResult(tempResult);
  };
  const hamming = () => {
    let tempResult = [];
    let tempMin = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < rowName.length; i++) {
      let temp = 0;
      for (let j = 0; j < colName.length; j++) {
        if (!(data[parseInt(target)][j] == data[i][j])) {
          temp += 1;
        }
      }
      tempResult.push(temp);
      if (
        target != i &&
        (tempMin == Number.MAX_SAFE_INTEGER || temp < tempResult[tempMin])
      ) {
        tempMin = i;
      }
    }
    setMax(tempMin);
    setDescription([]);
    setResult(tempResult);
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
      if (target != i && (tempMax == -1 || temp < tempResult[tempMax])) {
        tempMax = i;
      }
    }
    setMax(tempMax);
    setDescription([]);
    setResult(tempResult);
  };
  const euclid = () => {
    let tempResult = [];
    let tempMax = -1;
    for (let i = 0; i < rowName.length; i++) {
      let temp = 0;
      for (let j = 0; j < colName.length; j++) {
        temp += Math.pow(data[parseInt(target)][j] - data[i][j], 2);
      }
      temp = Math.sqrt(temp);
      tempResult.push(temp);
      if (target != i && (tempMax == -1 || temp < tempResult[tempMax])) {
        tempMax = i;
      }
    }
    setMax(tempMax);
    setDescription([]);
    setResult(tempResult);
  };
  const cosine = () => {
    let tempResult = [];
    let tempMax = -1;
    for (let i = 0; i < rowName.length; i++) {
      let temp = 0;
      let a = 0;
      let b = 0;
      for (let j = 0; j < colName.length; j++) {
        temp += parseFloat(data[parseInt(target)][j]) * parseFloat(data[i][j]);
        a += Math.pow(parseFloat(data[parseInt(target)][j]), 2);
        b += Math.pow(parseFloat(data[i][j]), 2);
      }
      temp = temp / (Math.sqrt(a) * Math.sqrt(b));
      tempResult.push(temp);
      if (target != i && (tempMax == -1 || temp > tempResult[tempMax])) {
        tempMax = i;
      }
    }
    setMax(tempMax);
    setDescription([]);
    setResult(tempResult);
  };
  const handleChangeMethod = (value) => {
    setMethod(value);
  };
  const handleChangeTarget = (value) => {
    setTarget(parseInt(value));
  };
  return (
    <Fragment>
      <h1>Similarity Calculator</h1>
      <table>
        <tr>{generateHeaderRow()}</tr>
        {generateTableData()}
      </table>
      <button onClick={addRow}>+ row</button>
      <button onClick={deleteRow}>- row</button>
      <button onClick={addCol}>+ column</button>
      <button onClick={deleteCol}>- column</button> <br />
      <p>
        Binary Similarity such as Simple Matching, Jaccard Coefficient, Hamming
        Distance will consider the number that is not 0 to be 1
      </p>
      <select
        value={target}
        onChange={(e) => handleChangeTarget(e.target.value)}
      >
        {target == null ? <option>Select Target</option> : null}
        {rowName.map((e, index) => (
          <option value={index}>{e}</option>
        ))}
      </select>
      <select
        value={method}
        onChange={(e) => handleChangeMethod(e.target.value)}
      >
        {method == null ? <option value={null}>Select Method</option> : null}
        <option value="smc">Simple Matching</option>
        <option value="jaccard">Jaccard Coefficient</option>
        <option value="hamming">Hamming Distance</option>
        <option value="manhattan">Manhattan</option>
        <option value="euclid">Euclidean</option>
        <option value="cosine">Cosine Similarity</option>
      </select>
      <button onClick={handleCompute}>Compute</button>
      {result != null &&
        result.map((e, i) => <div>{rowName[i] + ": " + e.toFixed(2)}</div>)}
      {result != null ? (
        <div>{"The first most similar is " + rowName[max]}<br/>{description.map(e=><div>{e}</div>)}</div>
      ) : null}
    </Fragment>
  );
};
export default Similarity;
