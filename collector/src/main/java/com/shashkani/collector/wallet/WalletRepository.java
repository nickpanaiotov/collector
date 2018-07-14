package com.shashkani.collector.wallet;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WalletRepository extends PagingAndSortingRepository<Wallet, String> {
}
