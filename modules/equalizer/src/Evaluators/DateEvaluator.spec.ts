import { DateEvaluator, DateProvider } from './DateEvaluator'

describe('when the time is October 4, 2023', () => {
  let dateEvaluator: DateEvaluator
  let dateProvider: DateProvider

  beforeEach(() => {
    const OCT_4_2023 = 1696450563013

    dateProvider = {
      now: jest.fn(() => OCT_4_2023),
    }
    dateEvaluator = new DateEvaluator(dateProvider)
  })

  it('should call the dateProvider "now" method', () => {
    dateEvaluator.isWithinTwoWeeks(1696450563013)
    expect(dateProvider.now).toHaveBeenCalled()
  })

  it('should throw if the given date is later than now', async () => {
    const OCT_6_2023 = 1696543200000
    expect(() => {
      dateEvaluator.isWithinTwoWeeks(OCT_6_2023)
    }).toThrow(RangeError)
  })

  it('should properly assess that the date is outside the two-week period', () => {
    const SEP_15_2023 = 1694728800000
    expect(dateEvaluator.isWithinTwoWeeks(SEP_15_2023)).toBe(false)
  })

  it('should properly assess that the date is in the two-week period', () => {
    const OCT_3_2023 = 1696284000000
    expect(dateEvaluator.isWithinTwoWeeks(OCT_3_2023)).toBe(true)
  })

  it('should correctly tell that the given timestamp is in a given range', () => {
    const OCT_4_2023 = 1696450563013
    expect(dateEvaluator.isInTimeRange(OCT_4_2023, 1)).toBe(true)
  })
})
