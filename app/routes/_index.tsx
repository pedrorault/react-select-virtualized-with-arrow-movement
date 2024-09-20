import type { MetaFunction } from "@remix-run/node";
import React, { useEffect, useRef } from "react";
import ReactSelect, { createFilter, MenuListProps } from "react-select";
import { FixedSizeList } from "react-window";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const options: Array<{ value: number; label: string }> = Array.from(
  { length: 1000 },
  (_, i) => ({ value: i, label: `Option ${i}` })
);

function Virtualized(props: MenuListProps) {
  const rows = React.Children.toArray(props.children);
  const menuListStyles = props.getStyles("menuList", props);
  const height = menuListStyles.height as number;

  const initialOffset = props.options.indexOf(props.focusedOption) * height;

  const scrollToIndex = rows.length
    ? props.options.indexOf(props.focusedOption)
    : 0;

  const listRef = useRef<FixedSizeList<any>>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(scrollToIndex);
    }
  }, [scrollToIndex]);

  return (
    <FixedSizeList
      ref={listRef}
      initialScrollOffset={initialOffset}
      itemSize={48}
      itemCount={props.options.length}
      height={height} // itemSize * options.length
      width={130}
    >
      {({ style, index }) => <div style={style}>{rows[index]}</div>}
    </FixedSizeList>
  );
}

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <ReactSelect
          filterOption={createFilter({ ignoreAccents: false })}
          options={options}
          components={{ MenuList: Virtualized }}
          styles={{ menuList: (base) => ({ ...base, height: 300 }) }}
        />
      </div>
    </div>
  );
}
