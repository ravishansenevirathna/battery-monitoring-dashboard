import React from 'react';
import './SectionHeader.css';

/**
 * Professional Section Header Component
 *
 * A reusable header component for sections with icon, title, description, and optional badge
 *
 * @param {Object} props
 * @param {React.ComponentType} props.icon - Lucide icon component
 * @param {string} props.title - Main title text
 * @param {string} props.description - Optional description text
 * @param {string} props.badge - Optional badge text (e.g., "4 Active", "Live")
 * @param {string} props.badgeColor - Badge color (default: green)
 * @param {string} props.iconColor - Icon color (default: #10b981)
 * @param {React.ReactNode} props.actions - Optional actions/controls (e.g., buttons, selects)
 */
const SectionHeader = ({
  icon: Icon,
  title,
  description,
  badge,
  badgeColor = '#10b981',
  iconColor = '#10b981',
  actions
}) => {
  return (
    <div className="section-header">
      <div className="section-header-main">
        <div className="section-header-icon" style={{ backgroundColor: `${iconColor}15` }}>
          {Icon && <Icon size={28} color={iconColor} />}
        </div>
        <div className="section-header-content">
          <div className="section-header-top">
            <h2 className="section-header-title">{title}</h2>
            {badge && (
              <span
                className="section-header-badge"
                style={{ backgroundColor: `${badgeColor}15`, color: badgeColor }}
              >
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="section-header-description">{description}</p>
          )}
        </div>
        {actions && (
          <div className="section-header-actions">
            {actions}
          </div>
        )}
      </div>
      <div className="section-header-divider"></div>
    </div>
  );
};

export default SectionHeader;
