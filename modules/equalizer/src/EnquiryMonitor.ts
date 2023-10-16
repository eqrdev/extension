export abstract class EnquiryMonitor<Enquiry> {
  async monitorEnquiries(): Promise<Enquiry[]> {
    const enquiries = await this.getEnquiries()

    await this.enquiriesFetched(enquiries)

    const enquiriesToRespond: Enquiry[] = []

    for (const enquiry of enquiries) {
      if (await this.isAlreadyChecked(enquiry)) {
        await this.enquiryAlreadyChecked(enquiry)
        continue
      }

      if (await this.shouldResponseEnquiry(enquiry)) {
        await this.respondEnquiry(enquiry)
        enquiriesToRespond.push(enquiry)
        await this.enquiryResponded(enquiry)
      }
    }

    return enquiriesToRespond
  }

  protected abstract isAlreadyChecked(enquiry: Enquiry): Promise<boolean>
  protected abstract respondEnquiry(enquiry: Enquiry): Promise<void>
  protected abstract getEnquiries(): Promise<Enquiry[]>
  protected abstract shouldResponseEnquiry(enquiry: Enquiry): Promise<boolean>

  /* eslint-disable @typescript-eslint/no-unused-vars */
  protected async enquiriesFetched(enquiries: Enquiry[]): Promise<void> {}
  protected async enquiryAlreadyChecked(enquiry: Enquiry): Promise<void> {}
  protected async enquiryResponded(enquiry: Enquiry): Promise<void> {}
  /* eslint-enable @typescript-eslint/no-unused-vars */
}
