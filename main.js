import * as fs from 'fs';
import { parse } from 'csv-parse';
import { FuzzySet } from './set.js';

const readCSV = () => {
    let header, rows = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream('./database.csv')
            .pipe(parse({ delimiter: ';', from_line: 1 }))
            .on('data', (row) => !header ? header = row : rows.push(row))
            .on('end', () => resolve({ header, rows }))
            .on('error', () => reject('Error occurred while reading CSV'))
    })
}

readCSV()
    .then(({ header, rows }) => {
        const fuzzySetS = new FuzzySet('s', { leftBoundary: 80, rightBoundary: 110 });
        const setSMembership = fuzzySetS.getMembershipFor(150);

        const fuzzySetZ = new FuzzySet('z', { leftBoundary: 80, rightBoundary: 100 });
        console.log(fuzzySetZ.getMembershipFor(1));

        const triangleSet = new FuzzySet('triangle', { leftBoundary: 80, rightBoundary: 100 });
        console.log(triangleSet.getMembershipFor(80))
    });

