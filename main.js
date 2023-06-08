import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
import { FuzzySet } from './set.js';

const OLD_MOVIES_SET = new FuzzySet('z', { leftBoundary: 2000, rightBoundary: 2010 });
const MEDIUM_OLD_MOVIES_SET = new FuzzySet('triangle', { leftBoundary: 1985, rightBoundary: 1995 });
const KIND_OF_NEW_MOVIES_SET = new FuzzySet('triangle', { leftBoundary: 2000, rightBoundary: 2015 });

const LONG_MOVIES_SET = new FuzzySet('s', { leftBoundary: 90, rightBoundary: 120 });
const NOT_LONG_MOVIES_SET = new FuzzySet('z', { leftBoundary: 90, rightBoundary: 120 });
const KIND_OF_LONG_MOVIES_SET = new FuzzySet('triangle', { leftBoundary: 110, rightBoundary: 130 });

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

const writeCSV = (rows, filename) => {
    const stream = fs.createWriteStream(path.join(path.resolve(), 'output', filename));
    const columns = rows.map(r => r[0].toString());
    const stringifier = stringify({ header: false, columns: columns });

    rows.forEach(r => {
        stringifier.write([r[1].toString()]);
    });

    stringifier.pipe(stream);
    console.log('SCRIPT FINISHED SUCCESSFULLY!');
}

const calculateMembership = (rows, colIndex, fuzzySet) => {
    return rows.map((row, i) => [i + 1, fuzzySet.getMembershipFor(getValueFromRow(row, colIndex))]);
} 

const getValueFromRow = (row, colIndex) => Number(row[colIndex]);

const getProduct = (setA, setB) => setA.map((setElementA, i) => setElementA[1] > setB[i][1] ? [setElementA[0], setB[i][1]] : [setElementA[0], setElementA[1]]);

const getSum = (setA, setB) => setA.map((setElementA, i) => setElementA[1] < setB[i][1] ? [setElementA[0], setB[i][1]] : [setElementA[0], setElementA[1]]);

readCSV()
    .then(({ rows }) => {
        const OLD_MOVIES = calculateMembership(rows, 4, OLD_MOVIES_SET);
        const MEDIUM_OLD_MOVIES = calculateMembership(rows, 4, MEDIUM_OLD_MOVIES_SET);
        const KIND_OF_NEW_MOVIES = calculateMembership(rows, 4, KIND_OF_NEW_MOVIES_SET);

        const LONG_MOVIES = calculateMembership(rows, 5, LONG_MOVIES_SET);
        const NOT_LONG_MOVIES = calculateMembership(rows, 5, NOT_LONG_MOVIES_SET);
        const KIND_OF_LONG_MOVIES = calculateMembership(rows, 5, KIND_OF_LONG_MOVIES_SET);
        
        // Finding out t-norm (old movies and kind of long movies)
        writeCSV(getProduct(OLD_MOVIES, KIND_OF_LONG_MOVIES), 'OLD-AND-KIND-OF-LONG.csv');

        // Finding out t-conorm (kind of old or not long movies)
        writeCSV(getSum(MEDIUM_OLD_MOVIES, NOT_LONG_MOVIES), 'MEDIUM-OLD-OR-NOT-LONG.csv');

        // Finding out t-norm (kind of new movies and long movies)
        writeCSV(getProduct(KIND_OF_NEW_MOVIES, LONG_MOVIES), 'KIND-OF-NEW-AND-LONG.csv');
    });

