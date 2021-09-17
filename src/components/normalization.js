import { Fragment } from "preact";
import { useState } from "preact/hooks";

const Normalization = () => {
  const [data, setData] = useState(
    Array(4).fill({ val: 0, minMax: 0, zScore: 0 })
  );
  const handleChangeData = (val, index) => {
    let temp = { ...data[index] };
    let tempArray = [...data];
    temp.val = parseInt(val);
    tempArray[index] = temp;
    setData(tempArray);
  };
  const GetZPercent = (z) => {
  
    if (z < -6.5) {
      return 0.0;
    }
  
    if (z > 6.5) {
      return 1.0;
    }
  
    var factK = 1;
    var sum = 0;
    var term = 1;
    var k = 0;
    var loopStop = Math.exp(-23);
  
    while(Math.abs(term) > loopStop) {
      term = .3989422804 * Math.pow(-1,k) * Math.pow(z,k) / (2 * k + 1) / Math.pow(2,k) * Math.pow(z,k+1) / factK;
      sum += term;
      k++;
      factK *= k;
    }
  
    sum += 0.5;
  
    return sum;
  }
  const handleCalculate = () => {
    let temp = [...data];
    let minValue = Math.min(...data.map((e) => e.val));
    let maxValue = Math.max(...data.map((e) => e.val));
    let sum = data.reduce((prev,cur) => prev + cur.val,0);
    let mean = sum / data.length;
    let sd = Math.sqrt(data.reduce((prev,cur) => prev + Math.pow((cur.val-mean),2),0) / data.length);
    for (let i in temp) {
      let tempObj = { ...temp[i] };
      if (minValue == maxValue) {
        tempObj.minMax = NaN;
      } else {
        tempObj.minMax = (tempObj.val - minValue) / (maxValue - minValue);
      }
      tempObj.zScore = GetZPercent((tempObj.val - mean) / sd)
      temp[i] = tempObj;
    }
    setData(temp);
  };
  const addRow = () => {
    setData((d) => [...d,{val:0,minMax:0,zScore:0}])
  }
  const removeRow = () => {
    let temp = [...data];
    temp.pop();
    setData(temp);
  }
  return (
    <Fragment>
      <h1>Normalization Calculator</h1>
      <div>
        <table>
          <tr>
            <th></th>
            <th>value</th>
            <th>min-max normalize</th>
            <th>z-score normalize</th>
          </tr>
          {data.map((item, index) => {
            return (
              <tr key={index}>
                <td>{index}</td>
                <td>
                  <input
                    value={item.val}
                    onChange={(e) => handleChangeData(e.target.value, index)}
                  />
                </td>
                <td>{item.minMax.toFixed(2)}</td>
                <td>{item.zScore.toFixed(2)}</td>
              </tr>
            );
          })}
        </table>
        <button onClick={addRow}>Add Row</button>
        <button onClick={removeRow}>Delete Row</button>
        <button onClick={handleCalculate}>Normalize</button>
      </div>
    </Fragment>
  );
};
export default Normalization;
