'use client';

import { useState } from 'react';

// Icons as simple SVGs
const MapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
    <line x1="9" y1="3" x2="9" y2="21"></line>
    <line x1="15" y1="3" x2="15" y2="21"></line>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

interface Stop {
  id: string;
  time: string;
  activity: string;
  description: string;
  duration: string;
}

interface Day {
  dayNumber: number;
  theme: string;
  stops: Stop[];
}

interface TripData {
  title: string;
  summary: string;
  days: Day[];
}

export default function TripPlanner() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [expandedStops, setExpandedStops] = useState<Set<string>>(new Set());

  const generateTrip = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate trip');
      }

      setTripData(data);
      // Auto-expand all stops initially
      const allStopIds = new Set<string>();
      data.days?.forEach((d: Day) => d.stops?.forEach(s => allStopIds.add(s.id)));
      setExpandedStops(allStopIds);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (stopId: string) => {
    setExpandedStops(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stopId)) {
        newSet.delete(stopId);
      } else {
        newSet.add(stopId);
      }
      return newSet;
    });
  };

  const removeStop = (dayIndex: number, stopId: string) => {
    if (!tripData) return;
    const newData = { ...tripData };
    newData.days[dayIndex].stops = newData.days[dayIndex].stops.filter(s => s.id !== stopId);
    setTripData(newData);
  };

  const moveStop = (dayIndex: number, stopIndex: number, direction: 'up' | 'down') => {
    if (!tripData) return;
    const newData = { ...tripData };
    const stops = newData.days[dayIndex].stops;
    
    if (direction === 'up' && stopIndex > 0) {
      const temp = stops[stopIndex];
      stops[stopIndex] = stops[stopIndex - 1];
      stops[stopIndex - 1] = temp;
    } else if (direction === 'down' && stopIndex < stops.length - 1) {
      const temp = stops[stopIndex];
      stops[stopIndex] = stops[stopIndex + 1];
      stops[stopIndex + 1] = temp;
    }
    
    setTripData(newData);
  };

  return (
    <main className="container">
      <header>
        <h1>AI Trip Planner</h1>
        <p className="subtitle">Describe your dream vacation, and let AI plan the perfect itinerary.</p>
      </header>

      <section className="glass-panel">
        <div className="input-group">
          <textarea 
            placeholder="E.g., A 3-day romantic getaway to Paris focusing on art, food, and hidden gems. We love wine and prefer a relaxed pace."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
          <button 
            className="btn" 
            onClick={generateTrip} 
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <><div className="spinner"></div> Generating...</>
            ) : (
              <><MapIcon /> Generate Itinerary</>
            )}
          </button>
        </div>

        {error && (
          <div className="error-alert">
            <span>{error}</span>
            <button className="btn-retry" onClick={generateTrip}>Retry</button>
          </div>
        )}
      </section>

      {!tripData && !isLoading && !error && (
        <div className="empty-state">
          <div className="empty-icon">🌍</div>
          <h2>Ready to explore?</h2>
          <p>Your AI-generated day-by-day itinerary will appear here.</p>
        </div>
      )}

      {tripData && (
        <section className="trip-results animate-fade-in">
          <div className="glass-panel">
            <div className="trip-header">
              <h2 className="trip-title">{tripData.title}</h2>
              <p className="trip-summary">{tripData.summary}</p>
            </div>

            <div className="days-container">
              {tripData.days?.map((day, dayIndex) => (
                <div key={day.dayNumber} className="day-card">
                  <div className="day-header">
                    <span className="day-title">Day {day.dayNumber}</span>
                    <span className="day-theme">{day.theme}</span>
                  </div>
                  
                  <div className="stops-list">
                    {day.stops?.length === 0 && (
                      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>No stops for this day.</p>
                    )}
                    {day.stops?.map((stop, stopIndex) => {
                      const isExpanded = expandedStops.has(stop.id);
                      return (
                        <div key={stop.id} className="stop-item">
                          <div className="stop-actions" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: '0.5rem' }}>
                             <button className="btn-icon" onClick={() => moveStop(dayIndex, stopIndex, 'up')} disabled={stopIndex === 0} title="Move Up">
                               <ChevronUpIcon />
                             </button>
                             <button className="btn-icon" onClick={() => moveStop(dayIndex, stopIndex, 'down')} disabled={stopIndex === day.stops.length - 1} title="Move Down">
                               <ChevronDownIcon />
                             </button>
                          </div>
                          
                          <div className="stop-content">
                            <div className="stop-header">
                              <span className="stop-time">{stop.time}</span>
                              <div style={{display: 'flex', gap: '0.5rem'}}>
                                <button className="btn-icon" onClick={() => toggleExpand(stop.id)} title={isExpanded ? "Collapse details" : "Expand details"}>
                                  {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                </button>
                                <button className="btn-icon" onClick={() => removeStop(dayIndex, stop.id)} title="Remove stop">
                                  <TrashIcon />
                                </button>
                              </div>
                            </div>
                            <h3 className="stop-activity" style={{cursor: 'pointer'}} onClick={() => toggleExpand(stop.id)}>{stop.activity}</h3>
                            
                            {isExpanded && (
                              <div className="stop-details animate-fade-in" style={{marginTop: '0.5rem'}}>
                                <p className="stop-description">{stop.description}</p>
                                <div className="stop-footer">
                                  <span className="stop-duration">⏱ {stop.duration}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
