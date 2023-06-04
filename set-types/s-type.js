export class SType {
    constructor(setTypeData) {
        this.setTypeData = setTypeData;
    }

    getMembershipFor(value) {
        return this.interpolate(value)
    }

    interpolate(value) {
        if (!this.isBetweenBoundaries(value)) {
            return this.overBoundaryValue(value);
        }
        return (value - this.setTypeData.leftBoundary) / (this.setTypeData.rightBoundary - this.setTypeData.leftBoundary);
    }

    isBetweenBoundaries(value) {
        return value <= this.setTypeData.rightBoundary && value >= this.setTypeData.leftBoundary;
    }

    overBoundaryValue(value) {
        return value < this.setTypeData.leftBoundary ? 0 : 1;
    }
}