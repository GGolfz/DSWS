import { Fragment } from "preact";
import { useState } from "preact/hooks";

const Outlier = () => {
    const [data,setData] = useState('');
    const [result,setResult] = useState(null);
    const findOutlier = () => {
        let numbers = data.split(',')
        numbers = numbers.map(n => parseFloat(n)).sort((a,b) => a - b);
        let n = numbers.length;
        let q1 = 0;
        let q2 = 0;
        let q3 = 0;
        if(n%2 == 0) {
            if((n/2) % 2 == 0) {
                q1 = (numbers[(n/4)] + numbers[n/4 - 1])/2;
                q3 = (numbers[(n/2) + (n/4)] + numbers[(n/2) + (n/4) - 1])/2;
            } else {
                q1 = numbers[(n/2 + 1)/2 - 1];
                q3 = numbers[(n/2) + (n/2 + 1)/2 - 1];
            }
            q2 = (numbers[n/2 - 1] + numbers[n/2])/2;
        } else {
            if((n+1)/2 % 2 == 0) {
                q1 = numbers[(n+1)/4 - 1];
                q3 = numbers[((n+1)/2) + (n+1)/4 - 1];
            } else {
                q1 = (numbers[((n+1)/2 + 1)/2 - 1] + numbers[((n+1)/2 + 1)/2 - 2])/2;
                q3 = (numbers[((n+1)/2) + ((n+1)/2 + 1)/2 - 1] + numbers[((n+1)/2) + ((n+1)/2 + 1)/2 - 2])/2;
            }
            q2 = numbers[(n+1)/2 - 1];
        }
        let iqr = q3 - q1;
        let lowerbound = q1 - 1.5*iqr;
        let upperbound = q3 + 1.5*iqr;
        let outlier = [];
        numbers.forEach((num) => {
            if(num < lowerbound || num > upperbound) outlier.push(num);
        })
        setResult({
            sorted: numbers,
            q1,q2,q3,iqr,lowerbound,upperbound,
            outlier
        })

    }    
    return(
        <Fragment>
            <h1>Outlier Detector</h1>
            <textarea style={{width:'400px'}} rows="4" onChange={e=>setData(e.target.value)}>{data}</textarea><br/>
            <button onClick={findOutlier}>Find</button>
            {
                result != null ? (
                    <div>
                        <h3>Result</h3>
                        <ul>
                        <li>Sorted Number: {result.sorted.join(', ')}</li>
                        <li>Q1: {result.q1}, Q2 (Median): {result.q2}, Q3: {result.q3}</li>
                        <li>IQR: {result.iqr}</li>
                        <li>Lower Bound: {result.lowerbound}, Upper Bound: {result.upperbound}</li>
                        <li>Outlier: {result.outlier.length == 0 ? 'None' : result.outlier.join(', ')}</li>
                        </ul>
                    </div>
                ): null
            }
        </Fragment>
    )
}

export default Outlier;