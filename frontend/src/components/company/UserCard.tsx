import Image from "next/image";

interface UserCardProps {
  name: string;
  status: string;
  imageUrl: string;
}

export default function UserCard({ name, status, imageUrl }: UserCardProps) {
  return (
    <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 rounded-md shadow p-3 w-32">
      <Image
        src={imageUrl}
        alt={name}
        width={64}
        height={64}
        className="rounded-full mb-2 object-cover"
      />
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {name}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-400">{status}</p>
      <a href="#" className="text-xs text-blue-500 dark:text-blue-400 mt-1">
        See Details
      </a>
    </div>
  );
}
