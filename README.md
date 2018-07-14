#  Шашкънье-collector

Collecting wallets from etherium blockchain by their public keys.
      For "researching purposes" and a "good cause". 
      
## Services
The collector is composed by three independent services.

    collector:
       - backend service with rest interface
    db:
       - redis store running in persistent mode mapped outside of the conteiner 
    node:
       - nodejs app that could be distributed outside the collector

How to start 
    
    docker-compose up -d
    docker-compose scale node=5   
