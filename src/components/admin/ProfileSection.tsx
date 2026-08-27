import AvatarUpload from "@/components/AvatarUpload"
import Field from "@/components/admin/Field"
import Section from "@/components/admin/Section"
import type { ProfileData } from "@/lib/validation"
import type { ProfileField } from "@/components/admin/types"

type ProfileSectionProps = {
  data: ProfileData
  onFieldChange: (key: ProfileField, value: string | null) => void
}

export default function ProfileSection({ data, onFieldChange }: ProfileSectionProps) {
  return (
    <Section title="Perfil">
      <Field id="profile-name" label="Nombre" name="name" autoComplete="name" value={data.name} onChange={(value) => onFieldChange("name", value)} />
      <Field id="profile-bio" label="Bio" name="bio" value={data.bio} onChange={(value) => onFieldChange("bio", value)} />
      <AvatarUpload value={data.avatar} onChange={(value) => onFieldChange("avatar", value)} />
      <Field id="calendly-url" label="Link de agenda (Calendly / Cal.com)" name="calendlyUrl" type="url" autoComplete="url" value={data.calendlyUrl ?? ""} onChange={(value) => onFieldChange("calendlyUrl", value || null)} placeholder="https://calendly.com/tuusuario" />
    </Section>
  )
}
