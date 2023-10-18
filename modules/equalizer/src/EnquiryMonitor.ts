export interface EnquiryOperator<Enquiry> {
  respondEnquiry(enquiry: Enquiry): Promise<void>
  getEnquiries(): Promise<Enquiry[]>
}

export interface EnquiryEvaluator<Enquiry> {
  shouldRespond(enquiry: Enquiry): Promise<boolean>
  isAlreadyChecked(enquiry: Enquiry): Promise<boolean>
}

export interface EnquiryResultProcessor<Enquiry> {
  fetched?: (enquiries: Enquiry[]) => Promise<void>
  alreadyChecked?: (enquiry: Enquiry) => Promise<void>
  responded?: (enquiry: Enquiry) => Promise<void>
}

export abstract class EnquiryMonitor<Enquiry> {
  protected constructor(
    private operator: EnquiryOperator<Enquiry>,
    private evaluator: EnquiryEvaluator<Enquiry>,
    private resultProcessor: EnquiryResultProcessor<Enquiry>
  ) {}

  async monitorEnquiries(): Promise<Enquiry[]> {
    const enquiries = await this.operator.getEnquiries()

    await this.resultProcessor.fetched?.(enquiries)

    const enquiriesToRespond: Enquiry[] = []

    for (const enquiry of enquiries) {
      if (await this.evaluator.isAlreadyChecked?.(enquiry)) {
        await this.resultProcessor.alreadyChecked?.(enquiry)
        continue
      }

      if (await this.evaluator.shouldRespond(enquiry)) {
        await this.operator.respondEnquiry(enquiry)
        enquiriesToRespond.push(enquiry)
        await this.resultProcessor.responded(enquiry)
      }
    }

    return enquiriesToRespond
  }
}
