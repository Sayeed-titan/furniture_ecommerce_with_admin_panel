/**
 * Default policy page content, shown until an admin overrides it via
 * /admin/policies (stored as a SiteSetting row at that point — see
 * src/lib/settings.ts). Written in the small heading/bullet/bold syntax
 * parsed by src/lib/policy-markdown.tsx: "## Heading" starts a new
 * section, "- " starts a bullet list, "**text**" is bold, blank lines
 * separate paragraphs.
 */

export const DEFAULT_TERMS_CONTENT = `Welcome to presidentfurniturebd.com. These terms & conditions are applicable for all President Furniture products. By using this website, you confirm your understanding and acceptance of our policies. If you do not agree, please refrain from using this website.

President Furniture reserves the right to change, modify, and update these terms and conditions at any time. No notice needs to be provided of these changes.

## Fabric availability

Fabrics shown in images may not be available. In that case, customers are requested to choose from available fabrics by confirming with our team.

**Note:** President Furniture has the right to refund any purchase amount if the product is not available.

## Product disclaimer

The color of the actual product and the images on this website may vary due to wood grain, lighting, and photography. Please consider this slight variation before making a purchase.`;

export const DEFAULT_DELIVERY_CONTENT = `## Delivery time — stocked products

- **Within Dhaka Metropolitan Area:** delivered within 12–24 hours.
- **Outside Dhaka:** delivery may take up to 3 days.

## Delivery charges

Standard delivery charges apply, with separate rates for Dhaka and outside Dhaka. Charges apply as per company policy and may vary depending on location, distance, floor level, product type, and quantity. If direct access for delivery vans or transport is not available, additional labor charges may apply for carrying heavy products.

## Fitting & installation

Fitting and installation will be carried out by President Furniture wherever required. Please contact the respective showroom or our customer service number for fitting service after the product has been delivered to your location.`;

export const DEFAULT_RETURN_POLICY_CONTENT = `At President Furniture, customer satisfaction is our priority. To ensure a smooth experience, we allow product returns and exchanges under the following conditions:

- **Timeline:** Return or exchange requests must be made within 3 days of purchase/delivery.
- **Eligibility:** Product must be in unused and original condition with proof of purchase.
- **Not applicable:** Customized, fabric, or upholstered products.
- **Valid reasons:** Wrong, defective, or damaged product, or mismatch with description.
- **Service charge:** A 10% service fee will be charged on the value of returned products (except for wrong/defective deliveries).
- **Availability:** Exchange depends on product stock.
- **Exclusions:** Products damaged due to misuse or mishandling will not be accepted.`;

export const DEFAULT_WARRANTY_CONTENT = `- President Furniture provides a 24-month free service warranty for any manufacturing fault.
- This warranty covers repair or replacement of the defective part.
- Warranty does not cover damages resulting from misuse of the product or from normal wear and tear.
- To get this support, the customer must show the money receipt/invoice of purchase.
- Warranty does not apply to glass, marble, or granite items.
- Rainbow chair: 5-year parts replacement warranty.

Please contact **01721045283** for after-sales service.`;
