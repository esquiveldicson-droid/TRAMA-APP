import React, { useState } from 'react';
import { FamilyUser } from '../../types/family';

interface AvatarProps {
  user?: FamilyUser;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatusDot?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  user,
  size = 'md',
  showStatusDot = false,
  className = '',
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl font-bold',
  };

  const getInitials = (name?: string) => {
    if (!name) return 'FH';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const roleColors: Record<string, string> = {
    padre: 'border-[#E07A5F]',
    madre: 'border-[#819B84]',
    hijo: 'border-[#3D5A80]',
  };

  const borderColor = user ? roleColors[user.rol] || 'border-[#E07A5F]' : 'border-stone-300';

  return (
    <div
      onClick={onClick}
      className={`relative inline-block shrink-0 rounded-full select-none ${onClick ? 'cursor-pointer transition-transform active:scale-95' : ''} ${className}`}
    >
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 ${borderColor} bg-[#EFE7DA] flex items-center justify-center text-[#2C2724] font-semibold shadow-xs`}
      >
        {user?.avatar_url && !imageError ? (
          <img
            src={user.avatar_url}
            alt={user.nombre}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span>{getInitials(user?.nombre)}</span>
        )}
      </div>

      {showStatusDot && (
        <span
          className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full ring-1 ring-emerald-200"
          title="Activo en Familia Hub"
        />
      )}
    </div>
  );
};
