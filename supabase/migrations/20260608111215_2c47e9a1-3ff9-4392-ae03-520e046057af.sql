
CREATE OR REPLACE FUNCTION public.guard_profile_financial_fields()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- Allow service_role and admins to change anything
  IF auth.role() = 'service_role' OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  -- Otherwise force protected fields back to OLD values
  NEW.wallet_balance := OLD.wallet_balance;
  NEW.savings_balance := OLD.savings_balance;
  NEW.trust_score := OLD.trust_score;
  NEW.savings_percentage := OLD.savings_percentage;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.guard_profile_financial_fields() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS profiles_guard_financial ON public.profiles;
CREATE TRIGGER profiles_guard_financial
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_financial_fields();
