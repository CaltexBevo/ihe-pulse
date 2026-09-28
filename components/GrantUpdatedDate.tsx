import { INNOVATION_GRANTS_UPDATED_DATE, INNOVATION_GRANTS_UPDATED_ON } from "@/lib/innovation-grants-shared";

export default function GrantUpdatedDate() {
  return <>Last updated <time data-grant-updated dateTime={INNOVATION_GRANTS_UPDATED_DATE}>{INNOVATION_GRANTS_UPDATED_ON}</time></>;
}
