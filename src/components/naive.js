import { Fragment } from "preact";
import { useState } from "preact/hooks";

const Naive = () => {
  const [data, setData] = useState(Array(4).fill(Array(3).fill("")));
  const [result, setResult] = useState(null);
  const [conditions, setConditionList] = useState([]);
  const [condition, setCondition] = useState(null);
  const [colName, setColName] = useState(
    Array(3)
      .fill("")
      .map((_, index) => "Feature " + (index + 1))
  );
  const [rowName, setRowName] = useState(
    Array(4)
      .fill("")
      .map((_, index) => "Name " + (index + 1))
  );
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
    arr.push(<th>Class</th>);

    return arr;
  };
  const changeColumnName = (index, value) => {
    let temp = [...colName];
    temp[index] = value;
    setColName(temp);
    if (condition != null && condition.column != null) {
      if (temp.indexOf(condition.column) == -1) {
        setCondition(null);
      }
    }
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
  const predict = (data, condition) => {
    let temp = {};
    let classList = Array.from(new Set(data.map((e) => e.class)));
    temp.classList = classList;
    let probability = {};
    let maxProb = 0;
    for (let i of classList) {
      let prob = 1;
      let p0 = data.filter((e) => e.class == i).length;
      for (let j of condition) {
        let col = j["column"].toLowerCase();
        let val = j["value"];
        let p = data.filter((e) => e[col] == val && e.class == i).length / p0;
        prob *= p;
      }
      prob *= p0 / data.length;
      probability[i] = prob;
      if (prob > maxProb) maxProb = prob;
    }
    temp.probability = probability;
    temp.predict = Object.keys(probability).find(
      (key) => probability[key] == Math.max(maxProb)
    );
    setResult(temp);
  };
  const predictWithNaive = () => {
    let arr = [];
    for (let i = 0; i < rowName.length; i++) {
      let temp = {};
      for (let j = 0; j < colName.length - 1; j++) {
        temp[colName[j].toLowerCase()] = data[i][j];
      }
      temp["class"] = data[i][colName.length - 1];
      arr.push(temp);
    }
    predict(arr, conditions);
  };
  const renderColumnList = () => {
    let arr = [];
    if (condition == null || condition.value == null) {
      arr.push(<option>Select Column</option>);
    } else {
      arr.push(<option disabled>Select Column</option>);
    }
    for (let i = 0; i < colName.length - 1; i++) {
      if (conditions.findIndex((e) => e.column == colName[i]) == -1) {
        arr.push(<option value={colName[i]}>{colName[i]}</option>);
      }
    }
    return arr;
  };
  const renderValueList = () => {
    let arr = [];
    let col = condition.column;
    let colIndex = colName.indexOf(col);
    if (condition.value == null) {
      arr.push(<option disabled>Select Value</option>);
    } else {
      arr.push(<option disabled>Select Value</option>);
    }
    let valueList = {};
    data.forEach((e) => (valueList[e[colIndex]] = 1));
    valueList = Object.keys(valueList);
    for (let i = 0; i < valueList.length; i++) {
      arr.push(<option value={valueList[i]}>{valueList[i]}</option>);
    }
    return arr;
  };
  const setConditionColumn = (value) => {
    if (colName.indexOf(value) != -1) {
      setCondition({ column: value });
    }
  };
  const setConditionValue = (value) => {
    let col = condition.column;
    let colIndex = colName.indexOf(col);

    if (data.findIndex((e) => e[colIndex] == value) != -1) {
      setCondition({ column: col, value: value });
    }
  };
  const addCondition = () => {
    if (
      condition != null &&
      condition.column != null &&
      condition.value != null
    ) {
      setConditionList([...conditions, condition]);
      setCondition(null);
    }
  };
  const removeCondition = (index) => {
    let temp = [...conditions];
    temp.splice(index, 1);
    setConditionList(temp);
  };
  return (
    <Fragment>
      <h1>Naïve Bayes Calculation</h1>
      <div>
        <table>
          <tr>{generateHeaderRow()}</tr>
          {generateTableData()}
        </table>
        {conditions.length > 0 ? (
          <div>
            Conditions:{" "}
            {conditions.map((e, index) => (
              <li>
                {e.column}: {e.value}{" "}
                <button onClick={() => removeCondition(index)}>delete</button>
              </li>
            ))}
          </div>
        ) : null}
        <select
          value={condition?.column ?? null}
          onChange={(e) => setConditionColumn(e.target.value)}
        >
          {renderColumnList()}
        </select>
        {condition != null && condition.column != null ? (
          <select
            value={condition?.value ?? null}
            onChange={(e) => setConditionValue(e.target.value)}
          >
            {renderValueList()}
          </select>
        ) : null}
        <button onClick={addCondition}>add condition</button>
        <br />
        <button onClick={addRow}>+ row</button>
        <button onClick={deleteRow}>- row</button>
        <button onClick={addCol}>+ column</button>
        <button onClick={deleteCol}>- column</button> <br />
        <button onClick={predictWithNaive}>Predict</button>
        <div>
          {result != null ? (
            <Fragment>
              <h2>Result: </h2>
              <h3>
                Class List: {result.classList} <br />
                Probability: {result.probability} <br />
                Prediction Class: {result.predict}{" "}
              </h3>
            </Fragment>
          ) : null}
        </div>
      </div>
    </Fragment>
  );
};

export default Naive;
