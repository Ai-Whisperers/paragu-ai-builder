#!/bin/bash
# Production Site Verification Script
# Checks all production sites for deployment readiness

echo "=== PRODUCTION SITE VERIFICATION ==="
echo "$(date)"
echo ""

# Production sites list
production_sites=(
  "nexa-paraguay|nexaparaguay.com"
  "nexa-propiedades|nexapropiedades.com"
  "dayah-litworks|dayah-litworks.com"
  "de-abasto-a-casa|deabastoacasa.com"
  "superspuma|paragu-ai.com/s/es/superspuma"
  "fun4me|paragu-ai.com/fun4me"
)

sites_ready=0
sites_needing_attention=0
critical_issues=0

echo "Checking production sites..."
echo ""

for site_entry in "${production_sites[@]}"; do
  IFS='|' read -r slug domain <<< "$site_entry"
  
  echo "Site: $slug"
  echo "Domain: $domain"
  
  # Check 1: isLiveProduction flag
  is_live=$(jq -r '.isLiveProduction' sites/$slug/site.json 2>/dev/null || echo "false")
  if [[ "$is_live" != "true" ]]; then
    echo "  ❌ FAIL: isLiveProduction is not true"
    ((critical_issues++))
  else
    echo "  ✅ PASS: isLiveProduction = true"
    ((sites_ready++))
  fi
  
  # Check 2: demoMode flag (should not exist)
  has_demo=$(grep -c 'demoMode' sites/$slug/site.json)
  if [[ $has_demo -gt 0 ]]; then
    echo "  ❌ FAIL: demoMode flag still present"
    ((critical_issues++))
  else
    echo "  ✅ PASS: no demoMode flag"
    ((sites_ready++))
  fi
  
  # Check 3: placeholderFields (production sites should not have)
  has_placeholders=$(grep -c 'placeholderFields' sites/$slug/site.json)
  if [[ $has_placeholders -gt 0 ]]; then
    echo "  ⚠️  WARNING: placeholderFields present - requires review"
    ((sites_needing_attention++))
  else
    echo "  ✅ PASS: no placeholderFields"
    ((sites_ready++))
  fi
  
  # Check 4: domain configured properly (not null or paragu-ai.com path)
  if [[ "$domain" == "null" ]] || [[ "$domain" == *"paragu-ai.com"* ]]; then
    echo "  ❌ FAIL: domain not configured properly"
    ((critical_issues++))
  else
    echo "  ✅ PASS: domain configured"
    ((sites_ready++))
  fi
  
  # Check 5: integrations (at least one should be real, not all placeholders)
  has_real_integration=0
  if [[ -f sites/$slug/site.json ]]; then
    hubspot=$(jq -r '.integrations.hubspot.portalId' sites/$slug/site.json 2>/dev/null || echo "null")
    mailchimp=$(jq -r '.integrations.mailchimp.audienceId' sites/$slug/site.json 2>/dev/null || echo "null")
    ga4=$(jq -r '.integrations.analytics.ga4.measurementId' sites/$slug/site.json 2>/dev/null || echo "null")
    
    if [[ "$hubspot" != "null" && "$hubspot" != "" ]]; then
      ((has_real_integration++))
      echo "  ✅ Hubspot configured"
    fi
    if [[ "$mailchimp" != "null" && "$mailchimp" != "" ]]; then
      ((has_real_integration++))
      echo "  ✅ Mailchimp configured"
    fi
    if [[ "$ga4" != "null" && "$ga4" != "" ]]; then
      ((has_real_integration++))
      echo "  ✅ GA4 configured"
    fi
  fi
  
  if [[ $has_real_integration -eq 0 ]]; then
    echo "  ❌ FAIL: No real integrations configured"
    ((sites_needing_attention++))
  else
    echo "  ✅ PASS: Has at least one real integration"
    ((sites_ready++))
  fi
  
  echo ""
done

echo ""
echo "=== VERIFICATION SUMMARY ==="
echo ""
echo "Sites Ready for Deployment: $sites_ready/10"
echo "Sites Needing Attention: $sites_needing_attention/10"
echo "Critical Issues: $critical_issues"
echo ""

if [[ $sites_ready -eq 10 ]]; then
  echo "✅ ALL SITES READY FOR PRODUCTION"
  exit 0
elif [[ $critical_issues -eq 0 ]]; then
  echo "⚠️  CRITICAL ISSUES: 0 - Sites mostly ready"
  exit 1
else
  echo "❌ CRITICAL ISSUES FOUND: $critical_issues - Fix before deployment"
  exit 2
fi