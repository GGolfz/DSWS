import { Fragment } from "preact";
import { useState } from "preact/hooks";

const Association = () => {
  const [data, setData] = useState(Array(4).fill({ value: "" }));
  const [round, setRound] = useState(1);
  const [minSup, setMinSup] = useState(2);
  const [result, setResult] = useState([]);
  const handleChangeData = (val, index) => {
    let temp = { ...data[index] };
    let tempArray = [...data];
    temp.value = val;
    tempArray[index] = temp;
    setData(tempArray);
  };
  const addRow = () => {
    setData((d) => [...d, { value: "" }]);
  };
  const removeRow = () => {
    if (data.length > 1) {
      let temp = [...data];
      temp.pop();
      setData(temp);
    }
  };
  const getItemSet = (database) => {
    let itemSet = new Set();
    for (let client in database) {
      let items = database[client];
      for (let i of items) {
        itemSet.add(i);
      }
    }
    return itemSet;
  };

  const getSupport = (itemSet, database) => {
    let itemSupport = {};
    for (let item of itemSet) {
      let support = 0;
      for (let client in database) {
        let found = true;
        let itemKey = item.split("");
        for (let k of itemKey) {
          if (database[client].indexOf(k) === -1) {
            found = false;
          }
        }
        if (found) {
          support++;
        }
      }
      itemSupport[item] = support;
    }
    return itemSupport;
  };

  const convertSetToCombinations = (itemSet) => {
    let currentSize = itemSet[0].length;
    let currentCombinations = [];
    for (let i = 0; i < itemSet.length; i++) {
      for (let j = i + 1; j < itemSet.length; j++) {
        let combination =
          itemSet[i].slice(0, currentSize) + itemSet[j].slice(0, currentSize);
        combination = Array.from(new Set(combination.split("")))
          .sort()
          .join("");
        if (combination.length === currentSize + 1)
          currentCombinations.push(combination);
      }
    }
    let freqCount = {};
    for (let i of currentCombinations) {
      if (freqCount[i]) {
        freqCount[i]++;
      } else {
        freqCount[i] = 1;
      }
    }
    let freqCombinations = [];
    for (let i in freqCount) {
      if (freqCount[i] == Math.round(((currentSize + 1) * currentSize) / 2)) {
        freqCombinations.push(i);
      }
    }
    return freqCombinations;
  };

  const filterSupport = (itemSupport, value) => {
    let passSupport = [];
    for (let i in itemSupport) {
      if (itemSupport[i] >= value) {
        passSupport.push(i);
      }
    }
    return passSupport;
  };

  const handleCalculate = () => {
    let database = [];
    let result = [];
    for (let i in data) {
      database[i] = data[i].value.split(",").map((e) => e.trim());
    }

    let itemSet = getItemSet(database);
    let itemSupport = getSupport(itemSet, database);
    let passSupport = filterSupport(itemSupport, minSup);
    let freqCombinations = convertSetToCombinations(passSupport);
    result.push({
      itemSupport,
      passSupport,
      freqCombinations,
    });
    for (let i = 1; i < round; i++) {
      itemSet = convertSetToCombinations(passSupport);
      itemSupport = getSupport(itemSet, database);
      passSupport = filterSupport(itemSupport, minSup);
      freqCombinations = convertSetToCombinations(passSupport);
      result.push({
        itemSupport,
        passSupport,
        freqCombinations,
      });
    }
    setResult(result);
  };

  return (
    <Fragment>
      <h1>Association Calculator</h1>
      <div>
        <table>
          <tr>
            <th></th>
            <th>Items</th>
          </tr>
          {data.map((item, index) => {
            return (
              <tr key={index}>
                <td>User {index + 1}</td>
                <td>
                  <input
                    value={item.value}
                    onChange={(e) => handleChangeData(e.target.value, index)}
                  />
                </td>
              </tr>
            );
          })}
        </table>
        <div>
          Round:
          <button
            onClick={() => {
              if (round > 1) setRound(round - 1);
            }}
          >
            -
          </button>
          {round}
          <button
            onClick={() => {
              setRound(round + 1);
            }}
          >
            +
          </button>
        </div>
        <div>
          Min Support:
          <button
            onClick={() => {
              if (minSup > 1) setMinSup(minSup - 1);
            }}
          >
            -
          </button>
          {minSup}
          <button
            onClick={() => {
              setMinSup(minSup + 1);
            }}
          >
            +
          </button>
        </div>
        <button onClick={addRow}>Add Row</button>
        <button onClick={removeRow}>Delete Row</button>
        <button onClick={handleCalculate}>Calculate</button>
        {result.length > 0 ? (
          <div>
            {result.map((value, round) => {
              return (
                <div key={round}>
                  <h2>Round {round + 1}</h2>
                  <div>Item Support: {JSON.stringify(value.itemSupport)}</div>
                  <div>Pass Support: {JSON.stringify(value.passSupport)}</div>
                  <div>
                    Frequent Combinations:{" "}
                    {JSON.stringify(value.freqCombinations)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </Fragment>
  );
};
export default Association;
