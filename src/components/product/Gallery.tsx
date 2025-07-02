import Image from "next/image";

type Props = { url?: string; alt?: string };

export default function Gallery({ url, alt }: Props) {
  return (
    <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
      <Image
        src={url ?? "/placeholder.png"}
        alt={alt ?? ""}
        width={300}
        height={300}
        className="h-full w-full object-cover"
        priority
      />
    </div>
  );
}
