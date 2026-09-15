"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  INNOVATION_GRANT_JURISDICTIONS,
  getInnovationGrantJurisdictionLabel,
} from "@/lib/innovation-grants-directory";
import {
  INNOVATION_GRANTS_AREA_FILTERS,
  INNOVATION_GRANTS_AUDIENCE_FILTERS,
  type InnovationGrantJurisdictionCode,
} from "@/lib/innovation-grants-shared";

const finderDeadlines = [
  ["any", "Any deadline"],
  ["closing-14", "Closing in 14 days"],
  ["30-plus", "At least 30 days to prepare"],
  ["60-plus", "At least 60 days to prepare"],
  ["90-plus", "At least 90 days to prepare"],
  ["rolling", "Rolling or no fixed deadline"],
] as const;

function FinderSelect({
  id,
  name,
  label,
  className,
  value,
  onChange,
  children,
}: {
  id: string;
  name: string;
  label: string;
  className: string;
  value?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        name={name}
        className={`slot ${className}`}
        value={value}
        defaultValue={value === undefined ? (name === "deadline" ? "any" : "all") : undefined}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
      >
        {children}
      </select>
    </>
  );
}

export default function GrantFinder() {
  const [location, setLocation] = useState<"all" | InnovationGrantJurisdictionCode>("all");
  const locationLabel = location === "all" ? null : getInnovationGrantJurisdictionLabel(location);

  return (
    <form id="finder" action="/innovation-grants/directory" method="get" className="finder-form">
      <div className="sentence">
        <div className="finder-line">
          <span>I work with</span>
          <FinderSelect id="fWho" name="audience" label="Institution or role" className="q1">
            {INNOVATION_GRANTS_AUDIENCE_FILTERS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.id === "all" ? "All institutions and roles" : option.label}
              </option>
            ))}
          </FinderSelect>
        </div>
        <div className="finder-line location-line">
          <span>based in</span>
          <FinderSelect
            id="fLocation"
            name="location"
            label="Your institution's state or territory"
            className="q-location"
            value={location}
            onChange={(value) => setLocation(value as "all" | InnovationGrantJurisdictionCode)}
          >
            <option value="all">All states and territories</option>
            <optgroup label="States and District of Columbia">
              {INNOVATION_GRANT_JURISDICTIONS.filter(({ kind }) => kind === "state-or-dc").map(({ code, label }) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </optgroup>
            <optgroup label="U.S. territories">
              {INNOVATION_GRANT_JURISDICTIONS.filter(({ kind }) => kind === "territory").map(({ code, label }) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </optgroup>
          </FinderSelect>
        </div>
        {locationLabel && (
          <p className="location-helper" role="status">
            Includes nationwide grants and programs available to {locationLabel} institutions.
          </p>
        )}
        <div className="finder-line">
          <span>seeking funding for</span>
          <FinderSelect id="fWhat" name="area" label="Innovation area" className="q2">
            {INNOVATION_GRANTS_AREA_FILTERS.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </FinderSelect>
        </div>
        <div className="finder-line">
          <span>with</span>
          <FinderSelect id="fWhen" name="deadline" label="Deadline window" className="q3">
            {finderDeadlines.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </FinderSelect>
          <span className="sentence-period" aria-hidden="true">.</span>
        </div>
      </div>
      <button className="go" type="submit">Show my opportunities</button>
      <Link className="alt" href="/innovation-grants/directory">Browse everything instead</Link>
    </form>
  );
}
