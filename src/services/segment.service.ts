export class SegmentService {
  segment: string = 'trips';
  getCurrentSegment() {
    return this.segment;
  }
  setCurrentSegment(segment: string) {
    this.segment = segment;
  }
}
