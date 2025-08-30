import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export type UserPlan = 'Free' | 'Pro' | 'Enterprise';

export interface PlanFeatures {
  name: UserPlan;
  videoLimit: number | 'unlimited';
  aiAnalysis: 'basic' | 'advanced' | 'premium';
  exportFormats: boolean;
  prioritySupport: boolean;
  teamCollaboration: boolean;
  apiAccess: boolean;
}

const PLAN_FEATURES: Record<UserPlan, PlanFeatures> = {
  Free: {
    name: 'Free',
    videoLimit: 3,
    aiAnalysis: 'basic',
    exportFormats: false,
    prioritySupport: false,
    teamCollaboration: false,
    apiAccess: false,
  },
  Pro: {
    name: 'Pro',
    videoLimit: 50,
    aiAnalysis: 'advanced',
    exportFormats: true,
    prioritySupport: true,
    teamCollaboration: false,
    apiAccess: false,
  },
  Enterprise: {
    name: 'Enterprise',
    videoLimit: 'unlimited',
    aiAnalysis: 'premium',
    exportFormats: true,
    prioritySupport: true,
    teamCollaboration: true,
    apiAccess: true,
  },
};

export const useUserPlan = () => {
  const { user } = useAuth();

  const userPlan = useMemo((): UserPlan => {
    if (!user) return 'Free';
    
    // Check user metadata for subscription plan
    const planFromMetadata = user.user_metadata?.subscription_plan as UserPlan;
    if (planFromMetadata && PLAN_FEATURES[planFromMetadata]) {
      return planFromMetadata;
    }
    
    // Default to Free plan
    return 'Free';
  }, [user]);

  const planFeatures = PLAN_FEATURES[userPlan];
  const isFreePlan = userPlan === 'Free';
  const isProPlan = userPlan === 'Pro';
  const isEnterprisePlan = userPlan === 'Enterprise';

  const canUseFeature = (feature: keyof Omit<PlanFeatures, 'name'>) => {
    return planFeatures[feature];
  };

  const hasVideoLimit = () => {
    return typeof planFeatures.videoLimit === 'number';
  };

  const getVideoLimit = () => {
    return planFeatures.videoLimit;
  };

  const shouldShowUpgrade = () => {
    return isFreePlan;
  };

  return {
    userPlan,
    planFeatures,
    isFreePlan,
    isProPlan,
    isEnterprisePlan,
    canUseFeature,
    hasVideoLimit,
    getVideoLimit,
    shouldShowUpgrade,
  };
}; 