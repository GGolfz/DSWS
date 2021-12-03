import { Fragment } from "preact";
import { useState } from "preact/hooks";

const Association = () => {
  const [data, setData] = useState(Array(4).fill(""));
  const handleChange = (val, i) => {
    const newData = [...data];
    newData[i] = val;
    setData(newData);
  };
  const addRow = () => {
    setData((d) => [...d, ""]);
  };
  const removeRow = () => {
    if (data.length > 1) {
      let temp = [...data];
      temp.pop();
      setData(temp);
    }
  };
  const calculate = () => {
      
  };
  return (
    <Fragment>
      <h1>Association Rule Calculator</h1>
      <h3>Items separate by comma (Ex: Coke, Pepsi)</h3>
      <div>
        <table>
          <tr>
            <th>Id</th>
            <th>Items</th>
          </tr>
          {data.map((item, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <input
                    value={item}
                    onChange={(e) => handleChange(e.target.value, index)}
                  />
                </td>
              </tr>
            );
          })}
        </table>
        <button onClick={addRow}>Add Row</button>
        <button onClick={removeRow}>Remove Row</button>
        <button onClick={calculate}>Calculate</button>
      </div>
    </Fragment>
  );
};
export default Association;
