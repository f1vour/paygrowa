
-- 1) Tighten projects SELECT: members + admins only (remove Live public exposure)
DROP POLICY IF EXISTS "Org members read projects" ON public.projects;
CREATE POLICY "Org members read projects" ON public.projects
FOR SELECT TO authenticated
USING (is_org_member(organization_id, auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

-- Safe public discovery view for Live projects (only non-sensitive columns)
CREATE OR REPLACE VIEW public.projects_public
WITH (security_invoker = true) AS
SELECT
  id,
  organization_id,
  title,
  objective,
  description,
  type,
  country,
  state,
  language,
  age_range,
  gender,
  responses_required,
  estimated_minutes,
  reward_per_response,
  deadline,
  status,
  created_at
FROM public.projects
WHERE status = 'Live'::project_status;

GRANT SELECT ON public.projects_public TO authenticated;

-- 2) user_roles: add restrictive policy so only admins can write
CREATE POLICY "Only admins can write roles" ON public.user_roles
AS RESTRICTIVE
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
