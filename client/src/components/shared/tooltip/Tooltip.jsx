import React, { useState } from 'react';

const tooltipStyles = {
    position: 'absolute',
    padding: '6px 12px',
    background: '#333',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '14px',
    zIndex: 1000,
    whiteSpace: 'nowrap',
};

const getPosition = (position, rect) => {
    switch (position) {
        case 'top':
            return { left: rect.left + window.scrollX + rect.width / 2, top: rect.top + window.scrollY - 8 };
        case 'bottom':
            return { left: rect.left + window.scrollX + rect.width / 2, top: rect.bottom + window.scrollY + 8 };
        case 'left':
            return { left: rect.left + window.scrollX - 8, top: rect.top + window.scrollY + rect.height / 2 };
        case 'right':
            return { left: rect.right + window.scrollX + 8, top: rect.top + window.scrollY + rect.height / 2 };
        default:
            return { left: rect.left + window.scrollX + rect.width / 2, top: rect.top + window.scrollY - 8 };
    }
};

function Tooltip({ content, position = 'top', children }) {
    
    const [visible, setVisible] = useState(false);
    const [coords, setCoords] = useState({ left: 0, top: 0 });

    const wrapperRef = React.useRef();

    const showTooltip = () => {
        const rect = wrapperRef.current.getBoundingClientRect();
        const pos = getPosition(position, rect);
        setCoords(pos);
        setVisible(true);
    };

    const hideTooltip = () => setVisible(false);

    return (
        <span
            ref={wrapperRef}
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
        >
            {children}
            {visible && (
                <div
                    style={{
                        ...tooltipStyles,
                        left: coords.left,
                        top: coords.top,
                        transform: 'translate(-50%, -100%)',
                        position: 'fixed',
                    }}
                >
                    {content}
                </div>
            )}
        </span>
    );
}

export default Tooltip;
