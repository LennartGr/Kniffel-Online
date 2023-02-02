import * as Logic from "../Logic"

test('test get occurences', () => {
    expect(Logic.getOccurences([2, 2, 2, 4, 5])).toEqual([0, 3, 0, 1, 1, 0])
})

test('calc points lower section', () => {
    expect(Logic.calculatePointsLowerSection(2, [2, 2, 4, 2, 5])).toBe(6)
})

test('calc points 3 of a kind', () => {
    expect(Logic.calculatePointsNOfAKind(3, [1, 2, 3, 1, 1])).toBe(8)
})

test('calc points 4 of a kind, negative', () => {
    expect(Logic.calculatePointsNOfAKind(4, [1, 2, 3, 1, 1])).toBe(0)
})

test('calc points 5 of a kind', () => {
    expect(Logic.calculatePointsNOfAKind(5, [1, 1, 1, 1, 1])).toBe(5)
})

test('full house, negative', () => {
    expect(Logic.calculatePointsFullHouse([1, 1, 2, 2, 3])).toBe(0)
})

test('full house, positive', () => {
    expect(Logic.calculatePointsFullHouse([1, 2, 2, 2, 1])).toBeGreaterThan(0)
})

test('large straight, negative', () => {
    expect(Logic.calculatePointsStraight([1, 2, 3, 4, 6], true)).toBe(0)
})

test('large straight, positive', () => {
    expect(Logic.calculatePointsStraight([6, 5, 3, 2, 4], true)).toBeGreaterThan(0)
})

test('large straight, positive', () => {
    expect(Logic.calculatePointsStraight([1, 2, 3, 4, 5], true)).toBeGreaterThan(0)
})

test('small straight, negative', () => {
    expect(Logic.calculatePointsStraight([1, 2, 3, 6, 6], false)).toBe(0)
})

test('small straight, positive', () => {
    expect(Logic.calculatePointsStraight([1, 2, 3, 4, 6], false)).toBeGreaterThan(0)
})

test('small straight, positive', () => {
    expect(Logic.calculatePointsStraight([1, 2, 3, 4, 5], false)).toBeGreaterThan(0)
})

test('small straight, positive', () => {
    expect(Logic.calculatePointsStraight([2, 3, 4, 5, 5], false)).toBeGreaterThan(0)
})

test('small straight, positive', () => {
    expect(Logic.calculatePointsStraight([3, 3, 4, 5, 6], false)).toBeGreaterThan(0)
})

test('small straight, positive', () => {
    expect(Logic.calculatePointsStraight([1, 3, 4, 5, 6], false)).toBeGreaterThan(0)
})