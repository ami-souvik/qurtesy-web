import React, { useState } from 'react';

export function Tabs({ children }) {
  const [active, setActive] = useState(0);
  const tabList = React.Children.toArray(children).filter((child) => child.type && child.type.name === 'Tab');
  return (
    <div>
      <div className="flex">
        {tabList.map(({ props: { label } }, i) => (
          <div
            key={i}
            className="my-2 px-4 rounded cursor-pointer"
            style={{
              backgroundColor: active === i ? 'blue' : 'transparent',
            }}
            onClick={() => {
              setActive(i);
            }}
          >
            <p>{label}</p>
          </div>
        ))}
      </div>
      {tabList[active]}
    </div>
  );
}

export function Tab({ children }: { label: string }) {
  return children;
}
