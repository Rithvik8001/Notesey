import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export default function ActionCard({
  title,
  description,
  icon: Icon,
  href,
}: ActionCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Link
        href={href}
        className="block h-full p-6 bg-white rounded-lg border border-gray-200 hover:border-primary-200 hover:shadow-lg transition-all"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="p-3 bg-primary-50 rounded-lg">
                <Icon className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
