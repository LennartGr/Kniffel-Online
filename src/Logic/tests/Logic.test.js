import {getOccurences} from "../Logic"

test('test get occurences', () => {
    expect(getOccurences([2, 2, 2, 4, 5])).toEqual([0, 3, 0, 1, 1, 0])
})