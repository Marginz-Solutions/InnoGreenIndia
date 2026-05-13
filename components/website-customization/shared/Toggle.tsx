interface Props {
checked: boolean;
onChange: () => void;
}

export const Toggle = ({
checked,
onChange,
}: Props) => (
<button
onClick={onChange}
className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
      checked
        ? 'bg-[#1f7a36]'
        : 'bg-slate-300'
    }`}

>

<span

  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
    checked
      ? 'translate-x-6'
      : 'translate-x-1'
  }`}
/>

  </button>
);
