import { useState } from 'react'
import { getSettings, saveSettings, COLOR_PRESETS } from '../utils/settings'
import type { ThemeSettings } from '../utils/settings'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  onSettingsChange: (settings: ThemeSettings) => void
}

export default function SettingsPanel({ isOpen, onClose, onSettingsChange }: SettingsPanelProps) {
  const [settings, setSettings] = useState<ThemeSettings>(getSettings)
  const [saved, setSaved] = useState(false)

  if (!isOpen) return null

  const update = (partial: Partial<ThemeSettings>) => {
    const next = { ...settings, ...partial }
    setSettings(next)
  }

  const handleSave = () => {
    saveSettings(settings)
    onSettingsChange(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#1e1e1e] border-l border-[#333] z-50 flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#333]">
          <h2 className="text-lg font-semibold text-white">Settings</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#333] text-[#888] hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Theme Color */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Theme Color</h3>
            <div className="grid grid-cols-5 gap-3">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => update({ primaryColor: preset.primary, accentColor: preset.accent })}
                  className={`group flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                    settings.primaryColor === preset.primary
                      ? 'border-white/30 bg-[#2a2a2a]'
                      : 'border-transparent hover:bg-[#2a2a2a]'
                  }`}
                >
                  <div className="flex gap-1">
                    <div className="w-5 h-5 rounded-full" style={{ background: preset.primary }} />
                    <div className="w-5 h-5 rounded-full" style={{ background: preset.accent }} />
                  </div>
                  <span className="text-[10px] text-[#888] group-hover:text-white transition-colors">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Custom Colors</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs text-[#888] mb-1.5">Primary</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => update({ primaryColor: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-[#444] cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => update({ primaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-xs font-mono focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-[#888] mb-1.5">Accent</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => update({ accentColor: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-[#444] cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={settings.accentColor}
                    onChange={(e) => update({ accentColor: e.target.value })}
                    className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-xs font-mono focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Font Size</h3>
            <div className="flex bg-[#1a1a1a] rounded-xl p-1 border border-[#333]">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => update({ fontSize: size })}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all capitalize ${
                    settings.fontSize === size
                      ? 'bg-[var(--primary)] text-white shadow'
                      : 'text-[#888] hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Behavior */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Chat Behavior</h3>
            <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl border border-[#333]">
              <div>
                <p className="text-sm text-white">Send on Enter</p>
                <p className="text-xs text-[#888] mt-0.5">Press Enter to send, Shift+Enter for new line</p>
              </div>
              <button
                onClick={() => update({ sendOnEnter: !settings.sendOnEnter })}
                className={`w-12 h-7 rounded-full transition-all duration-200 ${settings.sendOnEnter ? 'bg-[var(--primary)]' : 'bg-[#444]'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${settings.sendOnEnter ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Preview</h3>
            <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#333] space-y-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold" style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})` }}>N</div>
                <div className="bg-[#2a2a2a] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-[#ececec]">
                  Hello! I can help with code, writing, analysis, and more.
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <div className="rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white" style={{ background: settings.primaryColor }}>
                  Can you write a Python function?
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#333]">
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})` }}
          >
            {saved ? '✓ Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </>
  )
}
