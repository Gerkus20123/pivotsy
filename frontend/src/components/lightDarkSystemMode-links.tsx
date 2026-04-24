import React from 'react'
import { Button } from './ui/button';
import { LightDarkModeData } from '../../constants/theme_selector_data';

function LightDarkSystemLinks() {
  return (
    <>
        {LightDarkModeData.map((item) => {

            const Icon = item.icon as React.ElementType;

            return (
                <Button
                    key={item.id}
                    variant='outline'
                    className="rounded-xl"
                >
                    <Icon size={18}/>
                </Button> 
            );
        })}
    </>
  )
}

export default LightDarkSystemLinks;