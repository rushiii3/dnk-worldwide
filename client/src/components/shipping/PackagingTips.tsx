"use client";

import { Package, Box, AlertTriangle, BoxesIcon } from "lucide-react";
import { PACKAGING_TIPS } from "../../lib/constants";

export function PackagingTips() {
  const getIcon = (iconName: string, className = "w-7 h-7") => {
    switch (iconName) {
      case "package":
        return <Package className={className} />;
      case "box":
        return <Box className={className} />;
      case "alert-triangle":
        return <AlertTriangle className={className} />;
      case "boxes":
        return <BoxesIcon className={className} />;
      default:
        return <Package className={className} />;
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-xl mb-6">
        Things to <span className="text-blue-600 font-medium">keep</span> in mind
      </h3>
      <div className="space-y-6">
        {PACKAGING_TIPS.map((tip) => (
          <div key={tip.id} className="flex items-start gap-4">
            <div className="text-blue-600 mt-1">
              {getIcon(tip.icon)}
            </div>
            <div>
              <h4 className="text-blue-600 font-medium mb-1">{tip.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {tip.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
