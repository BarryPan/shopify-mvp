type Props = {
  productType?: string;
  title: string;
  price?: { amount: string; currencyCode: string };
  description?: string;
  children: React.ReactNode; // 放 AddToCartForm
};

export default function Details({ productType, title, price, description, shortdescription, children }: Props) {
  return (
    <div className="flex flex-col">
      <p className="text-sm text-gray-500 mb-1">{productType ?? "Fruits"}</p>
      <h1 className="text-3xl font-semibold mb-2">{title}</h1>

      {price && (
        <p className="text-xl font-medium mb-6">
          {Number(price.amount).toLocaleString(undefined, {
            style: "currency",
            currency: price.currencyCode,
            maximumFractionDigits: 2,
          })}
        </p>
      )}

      {shortdescription && (
        <p className="text-[18px] text-gray-700 mb-8 max-w-md leading-relaxed">{shortdescription}</p>
      )}

      {children}
    </div>
  );
}
