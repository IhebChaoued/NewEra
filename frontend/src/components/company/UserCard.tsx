interface UserCardProps {
  name: string;
  status: string;
  imageUrl: string;
}

export default function UserCard({ name, status, imageUrl }: UserCardProps) {
  return (
    <div className="flex flex-col items-center text-center bg-white rounded-md shadow p-3 w-32">
      <img
        src={imageUrl}
        alt={name}
        className="w-16 h-16 rounded-full mb-2 object-cover"
      />
      <p className="text-sm font-medium">{name}</p>
      <p className="text-xs text-gray-400">{status}</p>
      <a href="#" className="text-xs text-blue-500 mt-1">
        See Details
      </a>
    </div>
  );
}
