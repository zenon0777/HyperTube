function WhyChooseCard({
  icon,
  title,
  desc,
  bg,
  border,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  bg: string;
  border: string;
}) {
  return (
    <div className={`${bg} border ${border} rounded-2xl p-8 text-center`}>
      <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h4 className="text-xl font-bold mb-3">{title}</h4>
      <p className="text-gray-400">{desc}</p>
    </div>
  );
}

export default WhyChooseCard;
