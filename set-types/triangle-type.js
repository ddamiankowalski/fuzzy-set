export class TriangleType {
    constructor(setTypeData) {
        this.setTypeData = setTypeData;
        this.mean = this.getMean()
    }

    getMean() {
        return (this.setTypeData.leftBoundary + this.setTypeData.rightBoundary) / 2;
    }

    getMembershipFor(value) {
        return this.interpolate(value)
    }

    interpolate(value) {
        if (!this.isBetweenBoundaries(value)) {
            return this.overBoundaryValue(value);
        }
        return value >= this.mean ? this.interpolateRight(value) : this.interpolateLeft(value);
    }

    interpolateLeft(value) { 
        return (value - this.setTypeData.leftBoundary) / (this.mean - this.setTypeData.leftBoundary);
    }

    interpolateRight(value) {
        return 1 - (value - this.mean) / (this.setTypeData.rightBoundary - this.mean);
    }

    isBetweenBoundaries(value) {
        return value <= this.setTypeData.rightBoundary && value >= this.setTypeData.leftBoundary;
    }

    overBoundaryValue() {
        return 0;
    }
}