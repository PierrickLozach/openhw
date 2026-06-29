'use client';

import { useState } from 'react';

interface Device {
  id: string;
  name: string;
  brand: string;
  category: string;
  status: 'locked' | 'unlocking' | 'liberated';
  originalEcosystem: string;
  liberatedFeatures: string[];
  guide?: {
    difficulty: 'easy' | 'medium' | 'hard';
    time: string;
    steps: string[];
    tools: string[];
    risks: string[];
  };
}

const DEVICE_DATABASE: Device[] = [
  {
    id: 'airpods-pro-2',
    name: 'AirPods Pro 2',
    brand: 'Apple',
    category: 'Audio',
    status: 'locked',
    originalEcosystem: 'Apple',
    liberatedFeatures: ['Android full support', 'Custom EQ', 'Spatial audio anywhere', 'Battery optimization'],
    guide: {
      difficulty: 'medium',
      time: '15-20 min',
      steps: [
        'Download OpenPods app on Android',
        'Put AirPods in pairing mode (hold button 3s)',
        'Connect via Bluetooth settings',
        'Open OpenPods for advanced features',
        'Enable "Find My" alternative with OpenPods',
        'Configure custom touch controls'
      ],
      tools: ['Android phone', 'OpenPods app (F-Droid)'],
      risks: ['No iCloud Find My', 'Firmware updates require iOS device']
    }
  },
  {
    id: 'kindle-paperwhite',
    name: 'Kindle Paperwhite',
    brand: 'Amazon',
    category: 'E-Reader',
    status: 'locked',
    originalEcosystem: 'Amazon',
    liberatedFeatures: ['Read any EPUB', 'No ads', 'Custom fonts', 'Calibre sync', 'Remove DRM'],
    guide: {
      difficulty: 'easy',
      time: '10 min',
      steps: [
        'Install Calibre on computer',
        'Add DeDRM plugin to Calibre',
        'Connect Kindle via USB',
        'Import your purchased books',
        'Convert to EPUB if needed',
        'Sideload via "Send to Kindle" or USB'
      ],
      tools: ['Calibre', 'DeDRM plugin', 'USB cable'],
      risks: ['Terms of service violation', 'Account ban (rare)']
    }
  },
  {
    id: 'ring-doorbell',
    name: 'Ring Video Doorbell',
    brand: 'Amazon/Ring',
    category: 'Smart Home',
    status: 'locked',
    originalEcosystem: 'Amazon/Ring',
    liberatedFeatures: ['Local recording', 'No subscription', 'Home Assistant', 'No cloud dependency'],
    guide: {
      difficulty: 'hard',
      time: '2-3 hours',
      steps: [
        'Set up Home Assistant on Raspberry Pi',
        'Install Ring integration (requires Ring account)',
        'Configure local RTSP stream extraction',
        'Set up Frigate for local AI detection',
        'Configure automations without Ring app',
        'Optional: Flash custom firmware (advanced)'
      ],
      tools: ['Raspberry Pi 4+', 'Home Assistant', 'Frigate NVR', 'microSD card'],
      risks: ['Warranty void', 'Complex setup', 'Some features may break with updates']
    }
  },
  {
    id: 'roomba-i7',
    name: 'Roomba i7+',
    brand: 'iRobot',
    category: 'Smart Home',
    status: 'locked',
    originalEcosystem: 'iRobot',
    liberatedFeatures: ['Local control', 'Custom schedules', 'No cloud', 'Home Assistant integration'],
    guide: {
      difficulty: 'medium',
      time: '30-45 min',
      steps: [
        'Extract Roomba credentials from iRobot app',
        'Use dorita980 library or Roomba980-Python',
        'Add to Home Assistant via REST980',
        'Configure local MQTT for real-time control',
        'Create automations based on presence',
        'Optional: Block cloud access in router'
      ],
      tools: ['Home Assistant', 'Python/Node.js', 'Router access'],
      risks: ['OTA updates may break integration', 'Some maps require cloud']
    }
  },
  {
    id: 'tesla-model-3',
    name: 'Tesla Model 3',
    brand: 'Tesla',
    category: 'Vehicle',
    status: 'locked',
    originalEcosystem: 'Tesla',
    liberatedFeatures: ['Third-party apps', 'Custom dashcam', 'Extended diagnostics', 'OBD access'],
    guide: {
      difficulty: 'hard',
      time: '1-2 hours',
      steps: [
        'Get Tesla API tokens via auth.tesla.com',
        'Install TeslaMate for local data logging',
        'Set up Grafana dashboards',
        'Configure third-party apps (Tessie, Stats)',
        'Optional: OBD2 adapter for extended diagnostics',
        'Explore comma.ai openpilot (Model 3 compatible)'
      ],
      tools: ['Docker', 'TeslaMate', 'Grafana', 'OBD2 adapter (optional)'],
      risks: ['API access may be revoked', 'Warranty concerns with hardware mods']
    }
  },
  {
    id: 'sonos-one',
    name: 'Sonos One',
    brand: 'Sonos',
    category: 'Audio',
    status: 'locked',
    originalEcosystem: 'Sonos',
    liberatedFeatures: ['AirPlay without S2', 'Local streaming', 'No app required', 'Multi-room alternatives'],
    guide: {
      difficulty: 'easy',
      time: '20 min',
      steps: [
        'Enable AirPlay 2 in Sonos settings',
        'Install SonoPad or similar third-party app',
        'Configure Music Assistant in Home Assistant',
        'Set up local music server (Plex/Jellyfin)',
        'Stream directly via UPnP/DLNA',
        'Create groups without Sonos app'
      ],
      tools: ['Music Assistant', 'Plex or Jellyfin', 'Home Assistant (optional)'],
      risks: ['Some features need Sonos app', 'Trueplay tuning requires app']
    }
  }
];

export default function OpenHW() {
  const [devices, setDevices] = useState<Device[]>(DEVICE_DATABASE);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showContribute, setShowContribute] = useState(false);

  const categories = ['all', ...new Set(DEVICE_DATABASE.map(d => d.category))];
  
  const filteredDevices = devices.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || d.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const startLiberation = (deviceId: string) => {
    setDevices(prev => prev.map(d => 
      d.id === deviceId ? { ...d, status: 'unlocking' as const } : d
    ));
    
    setTimeout(() => {
      setDevices(prev => prev.map(d => 
        d.id === deviceId ? { ...d, status: 'liberated' as const } : d
      ));
    }, 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🔓</div>
              <div>
                <h1 className="text-3xl font-bold text-white">OpenHW</h1>
                <p className="text-purple-300">Liberate your hardware. Actually own what you buy.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right text-sm">
                <div className="text-white font-medium">{devices.filter(d => d.status === 'liberated').length} devices liberated</div>
                <div className="text-purple-300">~$2,400 in unlocked value</div>
              </div>
              <button
                onClick={() => setShowContribute(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
              >
                + Add a guide
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search for a device (AirPods, Kindle, Tesla...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  filterCategory === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Documented devices', value: '127', icon: '📱' },
            { label: 'Liberation guides', value: '89', icon: '📖' },
            { label: 'Contributors', value: '2.4k', icon: '👥' },
            { label: 'Unlocked value', value: '$12M+', icon: '💰' }
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Device Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map(device => (
            <div
              key={device.id}
              className={`bg-white/5 border rounded-xl p-6 cursor-pointer transition-all hover:bg-white/10 ${
                device.status === 'liberated' ? 'border-green-500/50' : 'border-white/10'
              }`}
              onClick={() => setSelectedDevice(device)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs text-purple-400 font-medium mb-1">{device.brand}</div>
                  <h3 className="text-xl font-bold text-white">{device.name}</h3>
                  <div className="text-sm text-white/50">{device.category}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  device.status === 'liberated' ? 'bg-green-500/20 text-green-400' :
                  device.status === 'unlocking' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {device.status === 'liberated' ? '✓ Liberated' :
                   device.status === 'unlocking' ? '⏳ In progress...' :
                   '🔒 Locked'}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-white/40 mb-2">Features to unlock:</div>
                <div className="flex flex-wrap gap-1">
                  {device.liberatedFeatures.slice(0, 3).map((f, i) => (
                    <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                      {f}
                    </span>
                  ))}
                  {device.liberatedFeatures.length > 3 && (
                    <span className="px-2 py-1 bg-white/10 text-white/50 rounded text-xs">
                      +{device.liberatedFeatures.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {device.guide && (
                <div className="flex items-center justify-between text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(device.guide.difficulty)}`}>
                    {device.guide.difficulty === 'easy' ? 'Easy' :
                     device.guide.difficulty === 'medium' ? 'Medium' : 'Hard'}
                  </span>
                  <span className="text-white/50">⏱ {device.guide.time}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Device Detail Modal */}
      {selectedDevice && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setSelectedDevice(null)}>
          <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-purple-400 font-medium">{selectedDevice.brand} • {selectedDevice.category}</div>
                  <h2 className="text-2xl font-bold text-white mt-1">{selectedDevice.name}</h2>
                  <p className="text-white/60 mt-1">Original ecosystem: {selectedDevice.originalEcosystem}</p>
                </div>
                <button onClick={() => setSelectedDevice(null)} className="text-white/50 hover:text-white text-2xl">×</button>
              </div>
            </div>

            <div className="p-6">
              {/* Features to unlock */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">🎁 What you unlock</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedDevice.liberatedFeatures.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <span className="text-green-400">✓</span>
                      <span className="text-white">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Liberation Guide */}
              {selectedDevice.guide && (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">📖 Liberation guide</h3>
                    <div className="flex gap-4 mb-4">
                      <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getDifficultyColor(selectedDevice.guide.difficulty)}`}>
                        Difficulty: {selectedDevice.guide.difficulty === 'easy' ? 'Easy' :
                                     selectedDevice.guide.difficulty === 'medium' ? 'Medium' : 'Hard'}
                      </div>
                      <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium">
                        ⏱ {selectedDevice.guide.time}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-white/60 mb-2">Required tools:</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedDevice.guide.tools.map((tool, i) => (
                          <span key={i} className="px-3 py-1 bg-white/10 text-white rounded-lg text-sm">{tool}</span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedDevice.guide.steps.map((step, i) => (
                        <div key={i} className="flex gap-3 p-3 bg-white/5 rounded-lg">
                          <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {i + 1}
                          </div>
                          <span className="text-white">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risks */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">⚠️ Risks to know</h3>
                    <div className="space-y-2">
                      {selectedDevice.guide.risks.map((risk, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <span className="text-yellow-400">⚠</span>
                          <span className="text-white">{risk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Action Button */}
              <button
                onClick={() => startLiberation(selectedDevice.id)}
                disabled={selectedDevice.status !== 'locked'}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  selectedDevice.status === 'locked'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
                    : selectedDevice.status === 'unlocking'
                    ? 'bg-yellow-500/20 text-yellow-400 cursor-wait'
                    : 'bg-green-500/20 text-green-400'
                }`}
              >
                {selectedDevice.status === 'locked' ? '🔓 Start liberation' :
                 selectedDevice.status === 'unlocking' ? '⏳ Liberation in progress...' :
                 '✓ Device liberated!'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contribute Modal */}
      {showContribute && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setShowContribute(false)}>
          <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-white mb-4">📝 Contribute a guide</h2>
            <p className="text-white/60 mb-6">
              Have you liberated a device that&apos;s not documented yet? Share your knowledge with the community!
            </p>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Device name"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
              />
              <input
                type="text"
                placeholder="Brand"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
              />
              <textarea
                placeholder="Liberation steps..."
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowContribute(false)} className="flex-1 py-3 bg-white/10 text-white rounded-xl font-medium">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-medium">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
