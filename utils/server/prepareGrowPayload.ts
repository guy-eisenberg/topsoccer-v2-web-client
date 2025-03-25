export function prepareGrowPayload({
  price,
  description,
  user,
  success_url,
  cancel_url,
  update_url,
}: {
  price: number;
  description: string;
  user: {
    id?: string;
    full_name: string;
    phone: string;
    email: string;
  };
  success_url: string;
  cancel_url: string;
  update_url: string;
}) {
  const formData = new FormData();
  formData.append("pageCode", process.env.GROW_BIT_PAGE_CODE as string);
  formData.append("sum", price.toString());
  formData.append("successUrl", success_url);
  formData.append("cancelUrl", cancel_url);
  formData.append("description", description);
  formData.append("pageField[fullName]", user.full_name);
  formData.append("pageField[phone]", user.phone);
  formData.append("pageField[email]", user.email);
  formData.append("notifyUrl", update_url);

  return formData;
}
