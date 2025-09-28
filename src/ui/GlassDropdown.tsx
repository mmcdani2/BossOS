import { useEffect, useRef, useState } from "react";

type Option = { value: string; label: string };

export function GlassDropdown({
    id,
    name,
    value,
    options,
    onChange,
}: {
    id: string;
    name: string;
    value: string;
    options: Option[];
    onChange: (val: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef<HTMLDivElement | null>(null);

    // close on outside click
    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("click", onDoc);
        return () => document.removeEventListener("click", onDoc);
    }, []);

    return (
        <div ref={wrapRef} className="relative w-full">
            {/* hidden select for form compatibility */}
            <select id={id}
                name={name}
                defaultValue={value}           // ← use defaultValue
                hidden
                aria-hidden="true"
                tabIndex={-1}
            >
                {options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>

            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={`${id}-listbox`}
                onClick={() => setOpen(v => !v)}
                className="form-input form-input--center w-full relative cursor-pointer"
            >
                <span className="block w-full text-center">{options.find(o => o.value === value)?.label}</span>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70">▾</span>
            </button>

            {open && (
                <ul
                    id={`${id}-listbox`}
                    role="listbox"
                    className="absolute z-[70] mt-2 w-full max-h-60 overflow-auto rounded-xl border border-white/20 bg-black/80 backdrop-blur-md shadow-xl text-center"
                >
                    {options.map(o => (
                        <li
                            key={o.value}
                            role="option"
                            aria-selected={o.value === value}
                            onClick={() => { onChange(o.value); setOpen(false); }}
                            className={`px-4 py-2 cursor-pointer ${o.value === value ? "bg-white/10 font-semibold text-white" : "text-gray-200 hover:bg-white/5"
                                }`}
                        >
                            {o.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
