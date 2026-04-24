export default function UserMessage({ text }) {
  return (
    <div className="flex justify-end w-full">
      <div className="max-w-[80%] rounded-2xl rounded-br-md bg-[#1d3344] text-gray-100 px-4 py-3 text-sm leading-relaxed break-words shadow-sm">
        {text}
      </div>
    </div>
  )
}
