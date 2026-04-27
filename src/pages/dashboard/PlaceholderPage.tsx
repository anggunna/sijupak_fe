interface Props { title: string }

export default function PlaceholderPage({ title }: Props) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-300 mb-2">{title}</p>
        <p className="text-gray-400 text-sm">Halaman ini sedang dalam pengembangan</p>
      </div>
    </div>
  )
}
