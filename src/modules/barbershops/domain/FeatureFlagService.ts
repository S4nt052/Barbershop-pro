import { Barbershop, BarbershopSettings } from '../domain/Barbershop';

export class FeatureFlagService {
  static isFeatureEnabled(
    settings: BarbershopSettings,
    feature: keyof BarbershopSettings
  ): boolean {
    return !!settings[feature];
  }

  /**
   * More advanced logic could go here, like checking a 'plan' type
   * (e.g., 'BASIC' doesn't have 'allowPosts')
   */
  static canAccessModule(barbershop: Barbershop, moduleName: string): boolean {
    // Basic logic mapping modules to settings
    const featureMap: Record<string, keyof BarbershopSettings> = {
      'reviews': 'allowReviews',
      'posts': 'allowPosts',
      'booking': 'allowOnlineBooking',
      'public-site': 'showPublicSite'
    };

    const setting = featureMap[moduleName];
    if (!setting) return true; // Modules not in map are always active

    return this.isFeatureEnabled(barbershop.settings, setting);
  }
}
