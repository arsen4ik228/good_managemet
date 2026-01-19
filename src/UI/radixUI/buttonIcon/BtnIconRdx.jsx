import * as Tooltip from "@radix-ui/react-tooltip";

export default function BtnIconRdx({ icon, onClick, tooltipText }) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button onClick={onClick} style={{
            border: 'none',
            background: 'none',
            padding: '4px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            <img src={icon} alt="" />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content side="top" align="center" style={{
          backgroundColor: 'black',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          whiteSpace: 'nowrap'
        }}>
          {tooltipText}
          <Tooltip.Arrow style={{ fill: 'black' }} />
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
