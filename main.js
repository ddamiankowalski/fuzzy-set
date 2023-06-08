import * as fs from 'fs';
import { parse } from 'csv-parse';
import { FuzzySet } from './set.js';

const oldMoviesSet = new FuzzySet('z', { leftBoundary: 2000, rightBoundary: 2010 });
const longMoviesSet = new FuzzySet('s', { leftBoundary: 90, rightBoundary: 120 });

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

const calculateMembership = (rows, colIndex, fuzzySet) => {
    return rows.map(row => fuzzySet.getMembershipFor(getValueFromRow(row, colIndex)));
} 

const getValueFromRow = (row, colIndex) => Number(row[colIndex]);

readCSV()
    .then(({ header, rows }) => {
        const oldMoviesMembership = calculateMembership(rows, 4, oldMoviesSet);
        const longMoviesMembership = calculateMembership(rows, 5, longMoviesSet);
        console.log(longMoviesMembership)
    });

