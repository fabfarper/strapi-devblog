'use strict';

/**
 * `check-role` policy
 */

module.exports = async (policyContext, config, { strapi }) => {
  
  // strapi.log.info('check-role policy.');  
  const { userRole } = config;  

  const isEligible = 
    policyContext.state.user && 
    policyContext.state.user.role.name == userRole; // config.role
  
  if (isEligible)  {
    return true;
  }

  return false;
};